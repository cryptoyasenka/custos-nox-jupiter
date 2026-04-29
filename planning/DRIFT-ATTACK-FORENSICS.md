# Drift Attack Forensics — 2026-04-01 ($285M drain)

**Status:** SKELETON — TX hashes pending Yana verification (see "Verification protocol" below).
**Purpose:** Single source of truth for the on-chain evidence behind the $285M Drift attack chain. Used by F3 tech demo (TECH-DEMO-SCRIPT-F3.md), pitch slide 1 (PITCH-SCRIPT-F2.md), drift-timeline.tsx, README, and IDEA.md.
**Why this file exists:** prior planning docs cross-referenced `DRIFT-ATTACK-FORENSICS.md` but the file was never committed (commit `40c5560` claimed to update it but only touched 3 other files). This skeleton resolves the broken refs and documents the verification gap honestly.

---

## Public sources (verified 2026-04-26)

| Source | Confirmed claims |
| ------ | ---------------- |
| Chainalysis blog | $285M = "more than 50% of Drift TVL". Security Council multisig migrated to 2-of-5 with zero timelock. Three on-chain transactions in the attack chain. |
| Bloomberg | Date: 2026-04-01. Amount: $285M. Drift Protocol attribution. |
| CoinDesk | Same date/amount. Cross-confirms Bloomberg. |

**What Chainalysis did NOT publish:** prior multisig configuration before the migration to 2-of-5 (so claims like "5-of-9" or "single-signer-equivalent" are NOT backed and must not appear in pitch/demo).

---

## Attack chain — 4 on-chain steps

The four steps map 1:1 to the four Drift-class detectors live in Custos Nox today:

| # | Step | Detector | TX hash (mainnet) | Verified? |
| - | ---- | -------- | ----------------- | --------- |
| 1 | Multisig migrated to 2-of-5 + timelock=0 (Security Council) | `MultisigWeakeningDetector` + `TimelockRemovalDetector` | _to fill from Chainalysis_ | ⬜ |
| 2 | Durable nonce account initialized + nonce authority set to attacker-controlled signer | `PrivilegedNonceDetector` | _to fill from Chainalysis_ | ⬜ |
| 3 | Pre-signed admin transfer executed using stale nonce | `StaleNonceExecutionDetector` | _to fill from Chainalysis_ | ⬜ |
| 4 | (Adjacent vector — not used in Drift but covered by us) Signer set rotation in similar Squads pattern | `SignerSetChangeDetector` | n/a — adjacent | n/a |

**Note:** the `MultisigWeakeningDetector` and `TimelockRemovalDetector` would both fire on step 1 (threshold reduction *and* timelock removal in the same config-change tx). One alert is enough to stop the chain.

---

## Verification protocol (for Yana — manual, before F3 recording)

Public Solana RPC retention is ~5 days. As of 2026-04-30 (29 days post-attack), `getTransaction` on a public RPC returns `null` for these signatures. Solscan and SolanaFM still index them indefinitely but their UIs block automated headless queries (Cloudflare / bot detection).

**Manual verification — do this once, in a real browser, before F3 recording:**

1. Open Chainalysis blog post on the Drift incident in a regular browser tab.
2. Copy each of the 3 TX signatures from the blog into the table above (replace `_to fill from Chainalysis_`).
3. For each signature: open `https://solscan.io/tx/<SIGNATURE>` and confirm it loads with the expected program-account interaction (Squads v4 program ID `SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf` for steps 1+3, System Program `1111...` for step 2).
4. Take a Solscan screenshot for each — used as B-roll in F3 demo.
5. Mark the row Verified=✅ once both blog source and Solscan render confirm.

**Fallback if Solscan rate-limits or hashes can't be retrieved:** use Chainalysis blog screenshots directly as on-screen evidence in F3, captioned `"via Chainalysis, [blog URL], retrieved 2026-04-30"`. This is acceptable for a demo video — primary source attribution is clean.

---

## Devnet smoke vs mainnet evidence — DO NOT CONFUSE

The TX hashes in `planning/demo-run-2026-04-19.md` (e.g. `5JwthXwm…batD`) are from our **devnet smoke harness reproducing the attack chain**. They are NOT the real Drift mainnet attack signatures. F3 must be explicit:

- Slide 1 / problem framing: real mainnet attack — cite Chainalysis hashes (this file).
- Slide 4 / live demo: devnet replay — cite `demo-run-2026-04-19.md` hashes.

Mixing them up in submission materials would be a credibility hit.

---

## Cross-references

- `planning/PITCH-SCRIPT-F2.md` slide 1 — narrative description (no hashes shown on screen).
- `planning/TECH-DEMO-SCRIPT-F3.md` — needs the 3 mainnet hashes for screenshots.
- `dashboard/components/drift-timeline.tsx` — visual timeline, currently does not embed hashes (good — keeps it general).
- `README.md` — references the $285M / >50% TVL number, sources Chainalysis.
- `planning/IDEA.md` — high-level "why now" framing.
