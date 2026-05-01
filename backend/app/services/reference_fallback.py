"""Keyword / fuzzy fallback when Qdrant is unavailable."""

from __future__ import annotations

import logging
import re
from difflib import SequenceMatcher, get_close_matches
from functools import lru_cache
from typing import Any

from app.services.reference_chunks import load_fallback_records

logger = logging.getLogger(__name__)

_TOKEN_SPLIT = re.compile(r"[^\w\u0900-\u097F]+", re.UNICODE)
_LEXEME_SPLIT = re.compile(r"[\s+/(),%-]+")

_HINGLISH_EXPANSIONS: dict[str, str] = {
    "bukhar": "fever",
    "khansi": "cough",
    "gaay": "cow",
    "gai": "cow",
    "gay": "cow",
    "bakri": "goat",
    "bhains": "buffalo",
    "bhainsa": "buffalo",
    "kutta": "dog",
    "billi": "cat",
    "murghi": "poultry",
    "murgi": "poultry",
    "bhainsiya": "ruminant",
    "dawai": "medicine drug dose",
    "davai": "medicine drug dose",
    "bughal": "diarrhoea",
    "khoon": "bleeding blood",
}


def _expand_query_tokens(tokens: set[str]) -> set[str]:
    expanded = set(tokens)
    for t in list(tokens):
        low = t.lower()
        if low in _HINGLISH_EXPANSIONS:
            for part in _HINGLISH_EXPANSIONS[low].split():
                expanded.add(part)
        if low in _HINGLISH_EXPANSIONS.values():
            expanded.add(low)
    return expanded


def expand_query_tokens(tokens: set[str]) -> set[str]:
    """Expand Hinglish tokens to English aliases for retrieval (exported for tests)."""
    return _expand_query_tokens(tokens)


def _tokenize(q: str) -> set[str]:
    return {x for x in _TOKEN_SPLIT.split(q.lower()) if len(x) > 1}


def _token_matches_chunk_text(token: str, text_lower: str) -> bool:
    """Whole-token match so query 'dose' does not match the substring inside 'min_dose'."""
    if len(token) < 2:
        return False
    return (
        re.search(rf"(?<![\w]){re.escape(token)}(?![\w])", text_lower, flags=re.UNICODE) is not None
    )


@lru_cache(maxsize=1)
def _cached_records() -> list[dict[str, Any]]:
    return load_fallback_records()


@lru_cache(maxsize=1)
def _all_drug_lexemes() -> frozenset[str]:
    """Substrings of drug names (e.g. amoxicillin from 'amoxicillin sodium') for typo matching."""
    out: set[str] = set()
    for rec in _cached_records():
        for part in _LEXEME_SPLIT.split(rec["drug_lower"]):
            p = part.strip().lower()
            if len(p) >= 4:
                out.add(p)
    return frozenset(out)


def retrieve_fallback_context(query: str, top_k: int = 8) -> str:
    """Lexical overlap + fuzzy drug names over local JSON chunks."""
    records = _cached_records()
    if not records:
        return "No relevant chunks found."

    tokens = set(_expand_query_tokens(_tokenize(query)))
    lexemes = _all_drug_lexemes()
    for t in list(tokens):
        if len(t) < 4:
            continue
        for lex in lexemes:
            if SequenceMatcher(None, t, lex).ratio() >= 0.72:
                tokens.add(lex)
    if not tokens:
        return "No relevant chunks found."

    scores: list[tuple[float, dict[str, Any]]] = []

    for rec in records:
        text_lower = rec["text_lower"]
        drug_l = rec["drug_lower"]
        overlap = sum(
            1
            for t in tokens
            if (len(t) >= 2 and t in drug_l)
            or (len(t) >= 3 and _token_matches_chunk_text(t, text_lower))
        )
        score = overlap

        for t in tokens:
            if len(t) >= 4 and drug_l:
                matches = get_close_matches(t, [drug_l], n=1, cutoff=0.75)
                if matches:
                    score += 3
                    break

        if score > 0:
            scores.append((float(score), rec))

    scores.sort(key=lambda x: -x[0])
    top = [r for _, r in scores[:top_k]]

    if not top:
        return "No relevant chunks found."

    parts = []
    for rec in top:
        parts.append(rec["text"])
    return "\n---\n".join(parts)
