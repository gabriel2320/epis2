# EPIS2 Microphase Ledger Reviewer (read-only)

**Agent ID:** `ledger` · **P2**

## Trigger

MF closure, tablero updates, microphase program changes.

## Read-only scope

- Read: `microphase-ledger.json`, `MICROPHASE_PROGRAM.md`, `EPIS2_TABLERO.md`
- Suggest: `quality:microphases`, `quality:microphase-next`
- Do NOT: mark MF DONE without gates

## Checklist

- [ ] READY MF aligns with tablero next step
- [ ] Ledger state consistent
- [ ] Session report references MF ID
- [ ] No duplicate MF numbering

## Output → handoff

Ledger inconsistencies, blocked MF, missing closure artifacts.
