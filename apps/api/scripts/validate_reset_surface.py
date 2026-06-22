from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]

RUNTIME_PATHS = [
    ROOT / "apps" / "web" / "src",
    ROOT / "apps" / "api" / "src" / "epis2_api",
    ROOT / "apps" / "api" / "tests",
    ROOT / "infra",
    ROOT / "packages" / "contracts" / "openapi.json",
    ROOT / "package.json",
]

FORBIDDEN_TOKENS = [
    "CICA",
    "Cica",
    "cica",
    "/espacio",
    "/app/buscar",
    "three modes",
    "OpenMRS",
    "Carbon",
    "clinical-case-intel",
    "drug-intel",
    "services/local-ai",
]

FORBIDDEN_PATH_PARTS = [
    "cica",
    "espacio",
    "clinical-case-intel",
    "drug-intel",
    "local-ai",
]


def iter_files() -> list[Path]:
    files: list[Path] = []
    for path in RUNTIME_PATHS:
        if path.is_file():
            files.append(path)
            continue
        if path.exists():
            files.extend(file for file in path.rglob("*") if file.is_file())
    return files


def main() -> int:
    failures: list[str] = []
    for file in iter_files():
        relative = file.relative_to(ROOT)
        normalized_path = str(relative).replace("\\", "/").lower()
        for part in FORBIDDEN_PATH_PARTS:
            if part in normalized_path:
                failures.append(f"{relative}: forbidden legacy path fragment '{part}'")

        try:
            content = file.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue

        for token in FORBIDDEN_TOKENS:
            if token in content:
                failures.append(f"{relative}: forbidden legacy token '{token}'")

    if failures:
        print("Reset surface validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Reset surface validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
