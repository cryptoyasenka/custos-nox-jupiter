# CURRENT — custos-nox-jupiter (sidetrack mirror)

**Last touched:** 2026-05-11 17:30 Kyiv
**Status:** Code complete. Submission BLOCKED — no live Jupiter sidetrack found.

## What this repo is

Independent mirror copy (not a GitHub fork) of the main Frontier submission at `cryptoyasenka/custos-nox`, with a sixth detector targeting the canonical Solana drainer fingerprint. The main Frontier submission lives in `C:\Projects\custos\` and is LOCKED — never touch it.

Purpose: submit to the **Jupiter "Not Your Regular" sidetrack**, if one ever materializes.

## Done

- [x] Cloned from main, origin repointed to `cryptoyasenka/custos-nox-jupiter`
- [x] Built `src/detectors/jupiter-exploit.ts` — detects unlimited (≥2^63) SPL Token Approve/ApproveChecked co-issued with a Jupiter Aggregator V6 call in the same transaction. Legitimate Jupiter users grant per-swap approval bounded by swap input; unlimited approval to the router is the signature of every drainer template.
- [x] Built `scripts/run-jupiter.ts` — standalone CLI watching `getSignaturesForAddress` for the guarded wallet, feeding each new tx through the detector. Discord fan-out via `CUSTOS_DISCORD_WEBHOOK`.
- [x] 13 unit tests + full suite 247 green
- [x] Commit `4c106a3`, pushed to `origin/main`

## Status: blocked

Verified 2026-05-11 17:00 Kyiv via 3 sources:
- Colosseum announcement explicitly states tracks/bounties **removed** from Frontier (replaced with single $30K Grand Champion)
- Superteam Earn API: zero listings match Jupiter "not your regular"
- WebSearch for current Jupiter bounty programs: no hits

Mirror repo stands as a portfolio artifact. If a Jupiter "Not Your Regular" bounty surfaces, submission values are ready at `C:\Users\Yana\.claude\snapshots\sidetrack-submit-values.md`.

## Next step

None autonomously. Yana decides in the morning whether to:
1. Wait for sponsor program to surface
2. Repurpose detector + CLI into the main repo as a 6th detector module
3. Archive the mirror repo
