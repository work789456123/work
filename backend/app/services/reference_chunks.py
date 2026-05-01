"""Load veterinary reference JSON files into plain-text chunks for indexing and fallback RAG."""

from __future__ import annotations

import hashlib
import json
import logging
from pathlib import Path
from typing import Any, Iterator

logger = logging.getLogger(__name__)

_VET_REF_DIR = Path(__file__).resolve().parents[2] / "data" / "vet_reference"


def _chunk_id(source_file: str, drug: str, index: int) -> str:
    raw = f"{source_file}:{drug}:{index}".encode()
    return hashlib.sha256(raw).hexdigest()[:16]


def _join_med(obj: dict[str, Any]) -> str:
    parts = []
    for k in sorted(obj.keys()):
        v = obj[k]
        if isinstance(v, list):
            parts.append(f"{k}: {', '.join(str(x) for x in v)}")
        else:
            parts.append(f"{k}: {v}")
    return "\n".join(parts)


def iter_reference_chunks() -> Iterator[tuple[str, dict[str, Any]]]:
    """Yield (point_id, payload) for each reference chunk. Payload includes 'text' for embedding."""
    if not _VET_REF_DIR.is_dir():
        logger.warning("vet_reference directory missing: %s", _VET_REF_DIR)
        return

    for path in sorted(_VET_REF_DIR.glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as e:
            logger.warning("Skip reference file %s: %s", path, e)
            continue

        source_file = path.name
        src_meta = data.get("source", "")
        skip_keys: set[str] = set()

        if "medications" in data and isinstance(data["medications"], list):
            skip_keys.add("medications")
            for i, med in enumerate(data["medications"]):
                if not isinstance(med, dict):
                    continue
                drug = str(med.get("drug", f"entry-{i}"))
                text = _join_med(med)
                full = f"source_file: {source_file}\nreference: {src_meta}\nanimal_label: {data.get('animal', '')}\n{text}"
                cid = _chunk_id(source_file, drug, i)
                yield cid, {
                    "text": full,
                    "drug": drug,
                    "source_file": source_file,
                    "animal": str(med.get("animal_type", med.get("animal", data.get("animal", "")))),
                    "reference": src_meta[:500],
                }

        for key, val in data.items():
            if key in skip_keys or key in ("source", "disclaimer", "animal", "animals_covered"):
                continue
            if not isinstance(val, list):
                continue
            for i, item in enumerate(val):
                if not isinstance(item, dict) or "drug" not in item:
                    continue
                drug = str(item.get("drug", f"{key}-{i}"))
                text = _join_med(item)
                full = f"source_file: {source_file}\nsection: {key}\nreference: {src_meta}\n{text}"
                cid = _chunk_id(source_file, f"{key}:{drug}", i)
                yield cid, {
                    "text": full,
                    "drug": drug,
                    "source_file": source_file,
                    "section": key,
                    "animal": str(item.get("animal", "")),
                    "reference": src_meta[:500],
                }


def load_fallback_records() -> list[dict[str, Any]]:
    """Flatten chunks into dicts for keyword fallback (includes lowercase text for matching)."""
    out: list[dict[str, Any]] = []
    for cid, payload in iter_reference_chunks():
        text = payload["text"]
        out.append(
            {
                "id": cid,
                "text": text,
                "text_lower": text.lower(),
                "drug_lower": str(payload.get("drug", "")).lower(),
                "payload": payload,
            }
        )
    return out
