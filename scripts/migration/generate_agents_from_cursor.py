#!/usr/bin/env python3
"""
Synchronise Cursor `.mdc` rule files with nested `AGENTS.md` documents.

- Directory-scoped rules → merged into the nearest `AGENTS.md` alongside code.
- Root-level rules → emitted as companion markdown files under `docs/rules/`.
- Output removes references to `.cursor`/`.mdc` and rewrites links to point at the
  new markdown sources or real code paths.
"""

from __future__ import annotations

import argparse
import os
import re
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple


MD_LINK_PATTERN = re.compile(r"\(mdc:([^)]+)\)")
GENERAL_LINK_PATTERN = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
CURSOR_PATH_PATTERN = re.compile(r"([A-Za-z0-9_/.\-]*\.cursor[^\s`]*\.mdc)")
PLAIN_MDC_PATTERN = re.compile(r"([A-Za-z0-9_/.\-]+\.mdc)")
CURSOR_DIR_PATTERN = re.compile(r"([A-Za-z0-9_/.\-]*)\.cursor(?:/rules)?/")


@dataclass
class RuleData:
    """Container for metadata and markdown body for a single rule."""

    source: Path
    description: Optional[str]
    raw_body: str

    @property
    def display_name(self) -> str:
        return self.source.stem.replace("_", " ").replace("-", " ").title()

    def render(self, repo_root: Path, target_dir: Path) -> str:
        lines: List[str] = [f"## Rule: {self.display_name}", ""]
        if self.description:
            desc = self.description.strip('"')
            lines.append(f"> {desc}")
            lines.append("")
        lines.append(normalise_body(self.raw_body, repo_root, target_dir))
        return "\n".join(lines).rstrip()


def parse_front_matter(text: str) -> Tuple[Optional[str], str]:
    """Split YAML front matter (returning description) from markdown body."""
    if text.startswith("---"):
        closing_index = text.find("\n---", 3)
        if closing_index != -1:
            yaml_block = text[4:closing_index].strip()
            remainder = text[closing_index + 4 :]
            description: Optional[str] = None
            for line in yaml_block.splitlines():
                stripped = line.strip()
                if stripped.lower().startswith("description:"):
                    description = stripped.split(":", 1)[1].strip()
                    break
            return description, remainder.lstrip("\n")
    return None, text.lstrip("\n")


def determine_target_directory(rule_path: Path, repo_root: Path) -> Path:
    """Return the directory where the generated AGENTS.md should live."""
    relative = rule_path.relative_to(repo_root)
    parts = relative.parts
    if ".cursor" not in parts:
        raise ValueError(f"Expected '.cursor' in rule path: {rule_path}")
    cursor_index = parts.index(".cursor")
    if cursor_index == 0:
        return repo_root
    return repo_root / Path(*parts[:cursor_index])


def collect_rules(repo_root: Path) -> Dict[Path, List[RuleData]]:
    """Group .mdc rules by the output directory that should receive them."""
    grouped: Dict[Path, List[RuleData]] = defaultdict(list)
    for rule_path in sorted(repo_root.rglob("*.mdc")):
        if "venv" in rule_path.parts or ".git" in rule_path.parts:
            continue
        description, body = parse_front_matter(rule_path.read_text())
        target_dir = determine_target_directory(rule_path, repo_root)
        grouped[target_dir].append(
            RuleData(
                source=rule_path.relative_to(repo_root),
                description=description,
                raw_body=body.strip(),
            )
        )
    return grouped


def clean_link_text(text: str) -> str:
    """Normalise link text by removing .mdc suffixes."""
    if text.endswith(".mdc"):
        text = text[:-4]
    return text.replace("_", " ").replace("-", " ").strip()


def convert_to_relative(path: Path, repo_root: Path, target_dir: Path) -> Optional[str]:
    """Return POSIX relative path from target_dir to path (assumed repo-root based)."""
    if not path:
        return None
    absolute = (repo_root / path) if not path.is_absolute() else path
    try:
        rel_path = os.path.relpath(absolute, target_dir)
    except ValueError:
        return None
    return Path(rel_path).as_posix()


def map_cursor_path(
    path_str: str,
    repo_root: Path,
    target_dir: Path,
) -> Optional[str]:
    """Map `.cursor` references to the new markdown destinations."""
    if path_str.endswith(".mdc") and ".cursor" not in path_str:
        name = Path(path_str).stem
        dest = Path("docs") / "rules" / f"{name}.md"
        mapped = convert_to_relative(dest, repo_root, target_dir)
        return mapped if mapped else path_str

    if ".cursor" not in path_str:
        return convert_to_relative(Path(path_str), repo_root, target_dir)

    path = Path(path_str)
    parts = path.parts
    if not parts:
        return None

    if parts[0] == ".cursor":
        dest = Path("docs") / "rules" / f"{path.stem}.md"
        return convert_to_relative(dest, repo_root, target_dir)

    if ".cursor" in parts:
        idx = parts.index(".cursor")
        base_parts = parts[:idx]
        dest_dir = Path(*base_parts) if base_parts else Path(".")
        dest = dest_dir / "AGENTS.md"
        return convert_to_relative(dest, repo_root, target_dir)

    return convert_to_relative(path, repo_root, target_dir)


def normalise_body(
    raw_body: str,
    repo_root: Path,
    target_dir: Path,
) -> str:
    """Rewrite mdc-specific links and remove Cursor-specific references."""
    body = raw_body.strip()

    def _convert_mdc(match: re.Match[str]) -> str:
        target = match.group(1).strip()
        mapped = map_cursor_path(target, repo_root, target_dir)
        if not mapped:
            return "()"
        return f"({mapped})"

    body = MD_LINK_PATTERN.sub(_convert_mdc, body)

    def _convert_general(match: re.Match[str]) -> str:
        text, target = match.groups()
        cleaned_text = clean_link_text(text)
        target = target.strip()

        if target.startswith("http://") or target.startswith("https://"):
            return f"[{cleaned_text}]({target})"

        mapped = map_cursor_path(target, repo_root, target_dir)
        if not mapped:
            return cleaned_text

        return f"[{cleaned_text}]({mapped})"

    body = GENERAL_LINK_PATTERN.sub(_convert_general, body)

    body = body.replace("mdc:", "")

    def _replace_plain_mdc(match: re.Match[str]) -> str:
        path_str = match.group(1)
        mapped = map_cursor_path(path_str, repo_root, target_dir)
        return mapped if mapped else path_str

    body = PLAIN_MDC_PATTERN.sub(_replace_plain_mdc, body)

    def _replace_cursor_path(match: re.Match[str]) -> str:
        path_str = match.group(1)
        mapped = map_cursor_path(path_str, repo_root, target_dir)
        return mapped if mapped else path_str

    body = CURSOR_PATH_PATTERN.sub(_replace_cursor_path, body)

    def _replace_cursor_dir(match: re.Match[str]) -> str:
        prefix = match.group(1).rstrip("/")
        if not prefix:
            dest = Path("docs") / "rules"
            mapped = convert_to_relative(dest, repo_root, target_dir)
            return mapped if mapped else "docs/rules"
        dest = Path(prefix) / "AGENTS.md"
        mapped = convert_to_relative(dest, repo_root, target_dir)
        return mapped if mapped else f"{prefix}/AGENTS.md"

    body = CURSOR_DIR_PATTERN.sub(_replace_cursor_dir, body)

    return body.strip()


def render_rules(
    rules: Iterable[RuleData],
    repo_root: Path,
    target_dir: Path,
) -> str:
    rendered_rules = [rule.render(repo_root, target_dir) for rule in rules]
    return "\n\n".join(rendered_rules).strip()


def _existing_prefix(path: Path) -> str:
    if not path.exists():
        return ""
    text = path.read_text()
    marker = "## Rule:"
    idx = text.find(marker)
    if idx == -1:
        return text.rstrip()
    return text[:idx].rstrip()


def update_agents_file(
    repo_root: Path, target_dir: Path, rules: List[RuleData]
) -> None:
    if not rules:
        return

    rules_block = render_rules(rules, repo_root, target_dir)
    agents_path = target_dir / "AGENTS.md"
    relative_dir = (
        target_dir.relative_to(repo_root).as_posix() if target_dir != repo_root else "."
    )

    prefix = _existing_prefix(agents_path)
    if not prefix:
        header_title = (
            f"# Agent Guidance for {relative_dir}"
            if relative_dir != "."
            else "# Agent Guidance for Project Root"
        )
        prefix = header_title

    prefix = prefix.rstrip()
    if prefix:
        new_content = f"{prefix}\n\n{rules_block}\n"
    else:
        new_content = f"{rules_block}\n"

    agents_path.write_text(new_content)


def write_companion_docs(repo_root: Path, rules: List[RuleData]) -> None:
    docs_root = repo_root / "docs" / "rules"
    docs_root.mkdir(parents=True, exist_ok=True)

    for rule in rules:
        output_path = docs_root / f"{rule.source.stem}.md"
        body = normalise_body(
            rule.raw_body,
            repo_root,
            output_path.parent,
        )
        lines: List[str] = [
            f"<!-- Generated from cursor rule '{rule.source.stem}' -->",
            "",
        ]
        if rule.description:
            desc = rule.description.strip('"')
            lines.extend([f"> {desc}", ""])
        lines.append(body)
        content = "\n".join(lines).strip() + "\n"
        output_path.write_text(content)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Convert Cursor .mdc rules into nested AGENTS.md files.",
    )
    parser.add_argument(
        "--repo-root",
        default=Path.cwd(),
        type=Path,
        help="Repository root (defaults to current working directory).",
    )
    args = parser.parse_args()

    repo_root = args.repo_root.resolve()
    grouped_rules = collect_rules(repo_root)

    for target_dir, rules in grouped_rules.items():
        if target_dir == repo_root:
            write_companion_docs(repo_root, rules)
        else:
            update_agents_file(repo_root, target_dir, rules)


if __name__ == "__main__":
    main()
