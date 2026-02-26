from __future__ import annotations

from pathlib import Path


def load_dataset(path: str) -> list[str]:
    file = Path(path)
    if not file.exists():
        return []
    return [line.strip() for line in file.read_text().splitlines() if line.strip()]
