// Standalone CLI that exercises JupiterExploitDetector against a real
// guarded wallet by polling `getSignaturesForAddress` for the guarded
// pubkey and feeding each new transaction into the detector as a
// TransactionEvent. Prints one JSON line per fired alert.
//
//   export CUSTOS_RPC_URL=https://api.mainnet-beta.solana.com
//   export CUSTOS_JUPITER_GUARDED=<guarded pubkey>
//   npm run watch:jupiter
//
// Stdout: one JSON line per fired alert. Optional Discord fan-out via
// CUSTOS_DISCORD_WEBHOOK. Independent of the main daemon path so the
// Frontier submission stays unchanged.

import { Connection, PublicKey } from "@solana/web3.js";
import {
  JUPITER_EXPLOIT_DETECTOR_NAME,
  makeJupiterExploitDetector,
} from "../src/detectors/jupiter-exploit.js";
import type { ParsedInstruction, TransactionEvent } from "../src/types/events.js";

const RPC = process.env.CUSTOS_RPC_URL ?? "https://api.mainnet-beta.solana.com";
const GUARDED_RAW = process.env.CUSTOS_JUPITER_GUARDED;
const POLL_MS = Number(process.env.CUSTOS_JUPITER_POLL_MS ?? 15_000);
const DISCORD = process.env.CUSTOS_DISCORD_WEBHOOK;
const LIMIT = 25;

if (!GUARDED_RAW) {
  process.stderr.write("CUSTOS_JUPITER_GUARDED is required (the guarded wallet to monitor).\n");
  process.exit(1);
}

const guarded = new PublicKey(GUARDED_RAW);
const connection = new Connection(RPC, "confirmed");
const detector = makeJupiterExploitDetector({ guardedMultisig: guarded });

const seen = new Set<string>();
const SEEN_CAP = 1024;
const seenOrder: string[] = [];

function recordSeen(sig: string): void {
  if (seen.has(sig)) return;
  seen.add(sig);
  seenOrder.push(sig);
  if (seenOrder.length > SEEN_CAP) {
    const evicted = seenOrder.shift();
    if (evicted) seen.delete(evicted);
  }
}

async function fanoutDiscord(line: string): Promise<void> {
  if (!DISCORD) return;
  try {
    await fetch(DISCORD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: `\`\`\`json\n${line}\n\`\`\`` }),
    });
  } catch (err) {
    process.stderr.write(`[discord] ${err instanceof Error ? err.message : String(err)}\n`);
  }
}

async function fetchTxInstructions(sig: string): Promise<ParsedInstruction[] | null> {
  const tx = await connection.getTransaction(sig, { maxSupportedTransactionVersion: 0 });
  if (!tx) return null;
  const msg = tx.transaction.message;
  const keys = msg.getAccountKeys({ accountKeysFromLookups: tx.meta?.loadedAddresses });

  // VersionedMessage has compiledInstructions with raw bytes; legacy Message
  // has instructions with base58-encoded data. Handle both.
  type CompiledIx = { programIdIndex: number; accountKeyIndexes: number[]; data: Uint8Array };
  const compiled: CompiledIx[] | undefined = (
    msg as unknown as { compiledInstructions?: CompiledIx[] }
  ).compiledInstructions;
  const source: CompiledIx[] = compiled ?? [];

  const out: ParsedInstruction[] = [];
  for (const ix of source) {
    const programId = keys.get(ix.programIdIndex);
    if (!programId) continue;
    const accounts: PublicKey[] = [];
    for (const i of ix.accountKeyIndexes) {
      const k = keys.get(i);
      if (k) accounts.push(k);
    }
    out.push({ programId, accounts, data: Buffer.from(ix.data) });
  }
  return out;
}

async function tick(): Promise<void> {
  let sigs: Awaited<ReturnType<Connection["getSignaturesForAddress"]>>;
  try {
    sigs = await connection.getSignaturesForAddress(guarded, { limit: LIMIT });
  } catch (err) {
    process.stderr.write(
      `[${JUPITER_EXPLOIT_DETECTOR_NAME}] signatures fetch failed: ${err instanceof Error ? err.message : String(err)}\n`,
    );
    return;
  }

  // RPC returns newest-first; iterate oldest-first.
  for (let i = sigs.length - 1; i >= 0; i--) {
    const entry = sigs[i];
    if (!entry) continue;
    if (seen.has(entry.signature)) continue;
    recordSeen(entry.signature);

    let instructions: ParsedInstruction[] | null;
    try {
      instructions = await fetchTxInstructions(entry.signature);
    } catch (err) {
      process.stderr.write(
        `[${JUPITER_EXPLOIT_DETECTOR_NAME}] tx fetch failed for ${entry.signature}: ${err instanceof Error ? err.message : String(err)}\n`,
      );
      continue;
    }
    if (!instructions) continue;

    const event: TransactionEvent = {
      kind: "transaction",
      program: guarded,
      signature: entry.signature,
      slot: entry.slot,
      timestamp: entry.blockTime ?? Math.floor(Date.now() / 1000),
      cluster: "mainnet",
      instructions,
    };

    const alert = await detector.inspect(event);
    if (!alert) continue;

    const line = JSON.stringify({
      detector: alert.detector,
      severity: alert.severity,
      subject: alert.subject,
      txSignature: alert.txSignature,
      explorerLink: alert.explorerLink,
      context: alert.context,
    });
    process.stdout.write(`${line}\n`);
    void fanoutDiscord(line);
  }
}

async function primeSeen(): Promise<void> {
  try {
    const sigs = await connection.getSignaturesForAddress(guarded, { limit: LIMIT });
    for (const s of sigs) recordSeen(s.signature);
    process.stderr.write(
      `[${JUPITER_EXPLOIT_DETECTOR_NAME}] primed ${sigs.length} known signatures for ${guarded.toBase58()}\n`,
    );
  } catch (err) {
    process.stderr.write(
      `[${JUPITER_EXPLOIT_DETECTOR_NAME}] prime failed: ${err instanceof Error ? err.message : String(err)}\n`,
    );
  }
}

async function main(): Promise<void> {
  process.stderr.write(
    `[${JUPITER_EXPLOIT_DETECTOR_NAME}] watching ${guarded.toBase58()} via ${RPC} every ${POLL_MS}ms\n`,
  );
  await primeSeen();
  for (;;) {
    await tick();
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
}

main().catch((err) => {
  process.stderr.write(
    `[${JUPITER_EXPLOIT_DETECTOR_NAME}] fatal: ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exit(1);
});
