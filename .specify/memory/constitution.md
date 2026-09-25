# Compass Constitution

## Core Principles

### I. Markdown Is the Source of Truth
Compass workflows MUST continue to read and write the existing Markdown notes and properties. Changes MUST preserve machine-readable property keys, tags, date formats, command IDs, template expressions, and link targets unless every consumer is migrated together. Translation MUST not introduce a second data store or silently rewrite personal notes.

### II. Personal Data Stays Under User Control
Work on the user's live vault MUST preserve journal, planning, people, and task content. Read only files needed for the request. Never publish credentials, private notes, agent sessions, or generated API keys. Apply changes to personal content only with authorization consistent with `AGENTS.md`.

### III. Runtime Compatibility Comes Before Presentation
The vault MUST open in the supported Obsidian version with its bundled plugins. Changes to dashboards, templates, or first-party plugin behavior MUST keep existing commands and workflows functional. Third-party plugin binaries and their licenses MUST remain intact. Changes to distributed binaries require a reproducible source or a separately reviewable local adaptation.

### IV. Chinese Copy Must Be Complete and Consistent
The Simplified Chinese edition MUST use consistent terms across the first-party interface, dashboards, guides, prompts, templates, and starter notes. User-facing text SHOULD be Chinese while technical identifiers and external names remain stable. Translations MUST preserve the original meaning and avoid adding advice, beliefs, sample data, or capabilities absent from the source.

### V. Claims Follow Observed Evidence
Static checks MUST verify links, template syntax, JSON, scripts, and release safety for affected files. Native Obsidian checks MUST verify the principal user flows before calling them functional. Reports MUST distinguish translated coverage, static validation, and behavior observed in the application.

## Repository Constraints

The repository is an Obsidian vault template. `元数据/Compass 配置.md` defines questions, habits, areas, folders, and prefixes; dashboard views under `元数据/视图/` depend on those contracts. `AGENTS.md` governs personal note edits. `scripts/verify_template.py` and the release scripts define template packaging and secret checks. Bundled community plugins retain their own licenses; guide prose is CC BY 4.0 and project code is MIT. Do not translate license texts, third-party binaries, command IDs, property keys, or code identifiers.

## Development Workflow

Maintain the Chinese edition on `main`. Before changes, inspect and protect personal workspaces. Record the specification, plan, and tasks with Spec Kit; migrate every path consumer when a user-facing filename changes. Review changed Markdown links, frontmatter, and executable blocks, check JavaScript syntax and behavior, and inspect a candidate vault in Obsidian. Record untranslated strings and unverified behavior explicitly.

## Governance

Amend this constitution with a documented reason and version change. MAJOR versions change or remove a principle, MINOR versions add a principle or materially expand scope, and PATCH versions clarify existing rules. Review specifications, plans, tasks, and completed changes against the active constitution. `AGENTS.md` remains the operational rulebook for vault content and user authorization.

**Version**: 1.1.0 | **Ratified**: 2026-09-24 | **Last Amended**: 2026-09-24

Version 1.1.0 moves localization maintenance to `main` and extends the Chinese naming requirement to first-party user-facing note files. Technical identifiers and external names remain stable.
