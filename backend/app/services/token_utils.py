"""Lightweight token estimation for history budget management.

No external dependency — uses the 4-chars-per-token heuristic which is accurate
enough for deciding when to trim conversation history.
"""
from __future__ import annotations


def estimate_tokens(text: str) -> int:
    """Approximate GPT token count (4 chars ≈ 1 token)."""
    return max(1, len(text) // 4) if text else 0


def messages_token_total(messages: list) -> int:
    """Sum tokens across a list of ORM ChatMessage objects."""
    total = 0
    for m in messages:
        content = getattr(m, "content", None) or ""
        total += estimate_tokens(content)
    return total


def trim_history_to_budget(messages: list, token_budget: int) -> list:
    """Return the most-recent messages whose combined content fits token_budget.

    Slides from the end so the freshest context is always kept.
    Always returns at least the last message so the LLM has some history context.
    """
    if not messages:
        return []
    total = 0
    start = len(messages)
    for i in range(len(messages) - 1, -1, -1):
        content = getattr(messages[i], "content", None) or ""
        total += estimate_tokens(content)
        if total > token_budget:
            start = i + 1
            break
    else:
        start = 0
    # Never return empty — always include the most recent message
    start = min(start, len(messages) - 1)
    return messages[start:]
