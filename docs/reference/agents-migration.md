# AGENTS.md Migration Plan

This document captures the agreed approach for duplicating the existing Cursor rules (`.cursor/rules/**/*.mdc`) into a nested `AGENTS.md` hierarchy so Codex-centric workflows can rely on directory-scoped agent instructions while the legacy `.mdc` files remain in place during the transition.

## Goals

- Preserve all current guidance from `.mdc` rules while exposing it through `AGENTS.md` files that Codex reads natively.
- Avoid overloading the root `AGENTS.md` with hundreds of lines by delegating domain-specific content to directory-level files.
- Keep the `.mdc` files untouched for now so Cursor-based tooling continues to function, enabling a reversible and auditable migration.
- Produce an idempotent generation script that can be rerun whenever `.mdc` rules change.

## Strategy Overview

1. **Rule Inventory**
   - Walk the repository to list every `.cursor/rules/*.mdc` file.
   - Categorise each rule as:
     - *Global*: applies everywhere (e.g., `python-coding-conventions.mdc`).
     - *Directory-scoped*: rule resides under a code directory (`tests/.cursor/rules/...`).
     - *Special/glob*: relies on metadata such as `globs` or `alwaysApply`.

2. **Output Mapping**
   - Directory-scoped rules → generate `AGENTS.md` in the parent code directory (e.g., `tests/AGENTS.md`).
   - Multiple rules in the same directory → merged into one file with section headings.
   - Global and special rules → referenced from the root `AGENTS.md`, pointing to concise companion markdown documents (e.g., `docs/rules/python-coding-conventions.md`) instead of duplicating long content inline.

3. **Conversion Script**
   - Implement a Python script to:
     - Read each `.mdc`.
     - Strip the YAML front matter while preserving the human-readable `description` field when present.
     - Collect the markdown body for reuse.
     - Compose or update the target `AGENTS.md`, inserting the generated block between stable markers so future runs can replace it idempotently.
   - The script skips directories where `AGENTS.md` is meant to stay hand-crafted (e.g., root file) and instead emits helper markdown documents under `docs/rules/` for global guidance.

4. **Root `AGENTS.md` Update**
   - Expand the existing root file to explain the layered structure:
     - Where to find global rules.
     - How directory `AGENTS.md` files are organised.
     - Pointers to companion documents for long-form guidance.
   - Keep the root file concise (under ~500 lines) by referencing rather than embedding detailed rules.

5. **Validation**
   - After generating a sample set (e.g., `tests/AGENTS.md`, `core/ingest/ingestion/AGENTS.md`), open those directories in Codex to confirm nested rules load alongside the root instructions.
   - Adjust formatting if Codex presents redundant or conflicting context.

6. **Rollout**
   - Once the output format is verified, run the script across the entire repository.
   - Review a diff to ensure each new `AGENTS.md` looks sensible and no existing manual edits are overwritten.
   - Keep `.mdc` files as the authoritative source until the team decides to deprecate them.

7. **Future Cleanup**
   - When ready, remove the `.mdc` files and update any automations relying on Cursor-specific metadata.
   - Promote the generation script (or its logic) into a maintainable utility if ongoing syncing is required.

## Special Considerations

- **Glob Rules (`init-py-standardization.mdc`)**: rather than duplicating guidance into every package directory, expose a root-level reminder that links to a dedicated markdown reference. Developers should open that document before editing `__init__.py` files.
- **Always-Apply Rules**: summarise their intent in the root file, then link to the full text stored in companion markdown (to keep the global context short while still discoverable).
- **Large Files**: if any derived `AGENTS.md` would exceed ~500 lines, split it into multiple documents (e.g., `AGENTS_core_ingest.md`) and reference them from a lightweight index within the directory.
- **Idempotency**: the generator preserves any content that appears before the first `## Rule:` heading, so keep hand-written summaries above that marker when customizing an `AGENTS.md`.

## Next Steps

1. Script the conversion logic.
2. Generate and review pilot `AGENTS.md` files.
3. Iterate on formatting and references.
4. Roll out across all directories once satisfied.

This plan provides a single reference for anyone continuing the migration or reviewing our approach later. Update it if strategy changes or once the `.mdc` files are formally retired.
