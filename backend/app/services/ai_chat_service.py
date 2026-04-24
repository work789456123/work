import json
import logging
import os
import re
import math
from collections import Counter
from functools import lru_cache
from typing import Any
from difflib import get_close_matches

try:
    from openai import AsyncOpenAI
except ModuleNotFoundError:  # pragma: no cover - enables import-time tests without full deps.
    AsyncOpenAI = None  # type: ignore[assignment]
from app.core.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Veterinary reference data — loaded once at startup
# ---------------------------------------------------------------------------
_REF_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "vet_reference")
_TOKEN_PATTERN = re.compile(r"[a-z0-9]+")
_STOPWORDS = {
    "the", "a", "an", "and", "or", "for", "to", "of", "in", "on", "at", "by", "with", "is", "are",
    "from", "this", "that", "it", "be", "as", "can", "if", "do", "not", "you", "your", "what",
    "how", "when", "where", "which", "about", "dose", "doses", "drug", "medicine", "medication",
    "animal", "animals", "pet", "pets", "cow", "cattle", "buffalo", "goat", "sheep"
}
_QUERY_SYNONYMS: dict[str, set[str]] = {
    "fever": {"bukhar", "pyrexia", "temperature"},
    "diarrhea": {"diarrhoea", "loosemotion", "dast"},
    "vomit": {"vomiting", "ulti"},
    "cow": {"cattle", "gaay", "gaai"},
    "buffalo": {"bhains"},
    "goat": {"bakri"},
    "sheep": {"bhed"},
    "calcium": {"milkfever", "hypocalcaemia", "hypocalcemia"},
    "magnesium": {"grassstaggers", "hypomagnesaemia", "hypomagnesemia"},
}
_ANIMAL_FILTER_TOKENS = {"cattle", "cow", "buffalo", "goat", "sheep", "poultry", "pig", "calf"}
_MAX_RETRIEVAL_CHARS = 5000
_TOP_K_RETRIEVAL = 8


def _normalize_tokens(text: str) -> set[str]:
    tokens = {t for t in _TOKEN_PATTERN.findall((text or "").lower()) if len(t) > 1}
    return {t for t in tokens if t not in _STOPWORDS}


def _expand_query_tokens(base_tokens: set[str]) -> set[str]:
    expanded = set(base_tokens)
    for token in list(base_tokens):
        if token in _QUERY_SYNONYMS:
            expanded.update(_QUERY_SYNONYMS[token])
        for canonical, variants in _QUERY_SYNONYMS.items():
            if token in variants:
                expanded.add(canonical)
                expanded.update(variants)
    return {t for t in expanded if t not in _STOPWORDS}


def _cattle_chunks(data: dict) -> list[dict[str, Any]]:
    chunks: list[dict[str, Any]] = []
    source = data.get("source", "cattle reference")
    animal = data.get("animal", "cattle")
    for med in data.get("medications", []):
        text = "\n".join(
            [
                f"Source: {source}",
                f"Animal: {animal}",
                f"Drug: {med.get('drug', 'unknown')}",
                f"Conditions: {', '.join(med.get('condition', []))}",
                f"Dose: {med.get('min_dose', 'n/a')} – {med.get('max_dose', 'n/a')}",
                f"Route: {med.get('route', 'n/a')}",
                f"Frequency: {med.get('frequency', 'n/a')}",
                f"Duration: {med.get('duration', 'n/a')}",
                f"Notes: {med.get('notes', 'n/a')}",
            ]
        )
        chunks.append(
            {
                "source_file": "cattle_medications.json",
                "title": str(med.get("drug", "unknown")),
                "text": text,
                "tokens": _normalize_tokens(text),
                "animal": str(med.get("animal_type", animal)).lower(),
            }
        )
    return chunks


def _svtg_chunks(data: dict) -> list[dict[str, Any]]:
    chunks: list[dict[str, Any]] = []
    source = data.get("source", "svtg reference")
    for key, value in data.items():
        if not isinstance(value, list):
            continue
        if key in {"animals_covered"}:
            continue
        for entry in value:
            if not isinstance(entry, dict):
                continue
            if "drug" not in entry:
                continue
            text = "\n".join(
                [
                    f"Source: {source}",
                    f"Category: {key}",
                    f"Drug: {entry.get('drug', 'unknown')}",
                    f"Animal: {entry.get('animal', 'n/a')}",
                    f"Dose: {entry.get('min_dose', 'n/a')} – {entry.get('max_dose', 'n/a')}",
                    f"Route: {entry.get('route', 'n/a')}",
                    f"Frequency: {entry.get('frequency', 'n/a')}",
                    f"Notes: {entry.get('notes', 'n/a')}",
                ]
            )
            chunks.append(
                {
                    "source_file": "svtg_medications.json",
                    "title": f"{entry.get('drug', 'unknown')} ({key})",
                    "text": text,
                    "tokens": _normalize_tokens(text),
                    "animal": str(entry.get("animal", "n/a")).lower(),
                }
            )
    return chunks


def _load_reference_chunks() -> list[dict[str, Any]]:
    chunks: list[dict[str, Any]] = []
    files = {
        "cattle_medications.json": _cattle_chunks,
        "svtg_medications.json": _svtg_chunks,
    }
    for filename, chunk_builder in files.items():
        path = os.path.join(_REF_DIR, filename)
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            chunks.extend(chunk_builder(data))
        except Exception as e:
            logger.warning("Could not load %s: %s", filename, e)
    logger.info("Loaded %s non-vector reference chunks", len(chunks))
    return chunks


_REFERENCE_CHUNKS = _load_reference_chunks()
_REFERENCE_DF: Counter[str] = Counter()
_AVG_DOC_LENGTH = 1.0
_KNOWN_DRUG_TERMS: set[str] = set()


def _build_reference_stats() -> None:
    global _AVG_DOC_LENGTH
    if not _REFERENCE_CHUNKS:
        return
    total_len = 0
    for chunk in _REFERENCE_CHUNKS:
        token_list = [
            t for t in _TOKEN_PATTERN.findall((chunk.get("text", "")).lower()) if t not in _STOPWORDS
        ]
        term_freq = Counter(token_list)
        chunk["term_freq"] = term_freq
        chunk["doc_len"] = sum(term_freq.values())
        total_len += chunk["doc_len"]
        for term in term_freq:
            _REFERENCE_DF[term] += 1
    _AVG_DOC_LENGTH = max(1.0, total_len / max(1, len(_REFERENCE_CHUNKS)))
    for chunk in _REFERENCE_CHUNKS:
        title = str(chunk.get("title", "")).lower()
        main_title = title.split("(")[0].strip()
        if main_title:
            _KNOWN_DRUG_TERMS.add(main_title)
        for term in _TOKEN_PATTERN.findall(main_title):
            if len(term) > 2 and term not in _STOPWORDS:
                _KNOWN_DRUG_TERMS.add(term)


_build_reference_stats()


def _bm25_score(chunk: dict[str, Any], query_terms: set[str], k1: float = 1.5, b: float = 0.75) -> float:
    score = 0.0
    tf_map: Counter[str] = chunk.get("term_freq", Counter())
    doc_len = max(1, int(chunk.get("doc_len", 1)))
    n_docs = max(1, len(_REFERENCE_CHUNKS))
    for term in query_terms:
        tf = tf_map.get(term, 0)
        if tf <= 0:
            continue
        df = _REFERENCE_DF.get(term, 0)
        idf = math.log(1 + (n_docs - df + 0.5) / (df + 0.5))
        denom = tf + k1 * (1 - b + b * (doc_len / _AVG_DOC_LENGTH))
        score += idf * ((tf * (k1 + 1)) / max(1e-9, denom))
    return score


def _animal_in_query(query_terms: set[str]) -> set[str]:
    return query_terms.intersection(_ANIMAL_FILTER_TOKENS)


def _format_context(selected: list[tuple[float, dict[str, Any]]]) -> str:
    lines: list[str] = []
    used_chars = 0
    for i, (score, chunk) in enumerate(selected, start=1):
        block = (
            f"[Chunk {i}] score={score:.3f} source={chunk['source_file']} title={chunk['title']}\n"
            f"{chunk['text']}\n\n"
        )
        if used_chars + len(block) > _MAX_RETRIEVAL_CHARS:
            break
        lines.append(block)
        used_chars += len(block)
    return "".join(lines).strip() if lines else "No relevant chunks found."


def _find_similar_drug_suggestions(query: str, query_tokens: set[str], limit: int = 3) -> list[str]:
    text_candidates = set(_TOKEN_PATTERN.findall(query.lower()))
    text_candidates.update(query_tokens)
    suggestions: list[str] = []
    seen = set()
    for token in text_candidates:
        if len(token) < 4:
            continue
        # Use a slightly looser cutoff so common typos still match (e.g. amoxirin -> amoxicillin).
        matches = get_close_matches(token, list(_KNOWN_DRUG_TERMS), n=limit, cutoff=0.62)
        for match in matches:
            if match not in seen and len(suggestions) < limit:
                seen.add(match)
                suggestions.append(match)
    return suggestions


def _chunks_for_suggested_drugs(suggestions: list[str], animal_tokens: set[str], max_chunks: int = 3) -> list[tuple[float, dict[str, Any]]]:
    if not suggestions:
        return []
    picked: list[tuple[float, dict[str, Any]]] = []
    for suggestion in suggestions:
        s = suggestion.lower().strip()
        if not s:
            continue
        for chunk in _REFERENCE_CHUNKS:
            if animal_tokens and not any(tok in chunk.get("animal", "") for tok in animal_tokens):
                continue
            title_lower = str(chunk.get("title", "")).lower()
            main_title = title_lower.split("(")[0].strip()
            if s == main_title or s in title_lower:
                picked.append((10.0, chunk))
                break
    # De-dupe while preserving order
    out: list[tuple[float, dict[str, Any]]] = []
    seen_titles: set[str] = set()
    for score, chunk in picked:
        key = f"{chunk.get('source_file')}::{chunk.get('title')}"
        if key in seen_titles:
            continue
        seen_titles.add(key)
        out.append((score, chunk))
        if len(out) >= max_chunks:
            break
    return out


@lru_cache(maxsize=1024)
def _retrieve_reference_context(query: str, top_k: int = _TOP_K_RETRIEVAL) -> str:
    query_tokens = _normalize_tokens(query)
    if not query_tokens or not _REFERENCE_CHUNKS:
        return "No relevant chunks found."
    query_tokens = _expand_query_tokens(query_tokens)
    animal_tokens = _animal_in_query(query_tokens)

    scored: list[tuple[float, dict[str, Any]]] = []
    for chunk in _REFERENCE_CHUNKS:
        # Hard filter for explicit animal queries when possible.
        if animal_tokens and not any(tok in chunk.get("animal", "") for tok in animal_tokens):
            continue
        lexical_overlap = len(query_tokens.intersection(chunk["tokens"]))
        if lexical_overlap == 0:
            continue
        score = _bm25_score(chunk, query_tokens)
        title_lower = chunk["title"].lower()
        query_lower = query.lower()
        # Boost exact-ish medicine mention.
        if any(term in title_lower for term in query_tokens):
            score += 0.5
        if title_lower.split("(")[0].strip() in query_lower:
            score += 1.0
        scored.append((score, chunk))

    if not scored:
        suggestions = _find_similar_drug_suggestions(query, query_tokens)
        if suggestions:
            selected = _chunks_for_suggested_drugs(suggestions, animal_tokens=animal_tokens, max_chunks=3)
            if selected:
                logger.info(
                    "RAG retrieval fallback via fuzzy drug match query='%s' suggestions=%s titles=%s",
                    query[:100],
                    suggestions,
                    [c["title"] for _, c in selected],
                )
                return _format_context(selected)
            return (
                "No relevant chunks found.\n"
                "Possible medicine matches (spelling/alias guess): "
                + ", ".join(suggestions)
            )
        return "No relevant chunks found."

    scored.sort(key=lambda item: item[0], reverse=True)
    selected = scored[:top_k]
    logger.info(
        "RAG retrieval query='%s' tokens=%s selected=%s top_titles=%s",
        query[:100],
        sorted(list(query_tokens))[:20],
        len(selected),
        [chunk["title"] for _, chunk in selected[:4]],
    )
    return _format_context(selected)

# ---------------------------------------------------------------------------
# Severity tag parsing
# ---------------------------------------------------------------------------

def _parse_severity(text: str) -> tuple[str, str]:
    """
    Extract the SEVERITY tag Gopu appends to every response.
    Returns (clean_response, severity_level).
    Falls back to 'low' if tag is missing or unrecognised.
    """
    match = re.search(r"\[SEVERITY:\s*(low|moderate|critical)\]", text, re.IGNORECASE)
    if match:
        level = match.group(1).lower()
        clean = text[:match.start()].rstrip() + text[match.end():]
        return clean.strip(), level
    return text.strip(), "low"


# ---------------------------------------------------------------------------
# AI Chat Service
# ---------------------------------------------------------------------------

class AIChatService:
    def __init__(self):
        if AsyncOpenAI is None:
            raise RuntimeError("openai package is not installed in this environment.")
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

        self.medication_rules = """
NON-VECTOR RAG POLICY:
- You are given RETRIEVED REFERENCE CHUNKS for each request.
- Use ONLY those retrieved chunks for medicine names, dose ranges, route, and frequency.
- Never use memory, guesswork, or external assumptions for dosages.
- If RETRIEVED REFERENCE CHUNKS are missing but a "Possible medicine matches" hint is present,
  ask a short clarification question and list the suggested medicine names.
- In that clarification case, DO NOT provide dosage yet; wait for user confirmation.
- If RETRIEVED REFERENCE CHUNKS contain relevant medicine rows, DO NOT use the unknown-medicine fallback.

MEDICATION GUIDANCE — STRICT RULES:
- You MAY name a medication and explain what it is used for.
- You MUST mention the general safe range (min and max dose) ONLY from RETRIEVED REFERENCE CHUNKS.
- CRITICAL: If the drug or animal combination is NOT found in RETRIEVED REFERENCE CHUNKS, say:
  "इस दवाई या बीमारी के बारे में मेरे पास अभी पूरी जानकारी नहीं है। कृपया एक पशु चिकित्सक से सलाह लें।"
  Do NOT guess or invent dosages.
- Always add this disclaimer after any medication mention:
  "सही खुराक और तरीका केवल एक प्रमाणित पशु चिकित्सक ही बता सकता है।"

SEVERITY TAGGING — MANDATORY:
At the very end of EVERY response, append exactly one tag on its own line:
  [SEVERITY: low]      — general query, minor issue, routine care
  [SEVERITY: moderate] — concerning symptoms, needs vet attention soon
  [SEVERITY: critical] — emergency, life-threatening, needs immediate vet
If unsure, default to [SEVERITY: moderate].
"""

        self.prompts = {
            "Hindi": f"""
आप पाशुवाणी (PashuVaani) के लिए एक मिलनसार और सरल एआई पशु चिकित्सा सहायक, गोपु (Gopu) हैं।
आपका लक्ष्य भारतीय पालतू और पशुपालकों की आसान और सही सलाह से मदद करना है।

भाषा का नियम (STRICT LANGUAGE RULE):
- आपको हमेशा सिर्फ और सिर्फ सरल हिंदी (देवनागरी लिपि) में जवाब देना है।
- **हिंग्लिश (Hinglish) या अंग्रेजी अक्षरों का इस्तेमाल बिल्कुल न करें।**
- यहाँ तक कि 'Doctor', 'Medicine', 'Fever' जैसे शब्दों को भी हिंदी में लिखें (डॉक्टर, दवाई, बुखार)।
- कोष्ठक (brackets) में भी अंग्रेजी शब्द न लिखें।

मुख्य नियम (CORE PRINCIPLES):
1. 'पशु भी परिवार है' भावना का पालन करें। बहुत ही आत्मीय और सरल भाषा का उपयोग करें।
2. जटिल चिकित्सा शब्दों से बचें। सीधी और आसान भाषा का उपयोग करें।
3. पूरी सहानुभूति रखें - हर जानवर को प्रिय परिवार के सदस्य की तरह मानें।
4. **सत्यता (GROUNDEDNESS)**: यदि आप किसी जानकारी के बारे में सुनिश्चित नहीं हैं, तो अनुमान न लगाएं। साफ कहें कि आपको इसके बारे में जानकारी नहीं है और डॉक्टर से सलाह लेने को कहें।

सुरक्षा (SAFETY):
- यदि जानवर की स्थिति बहुत खराब है, तो तुरंत डॉक्टर को दिखाने की सलाह दें।

जवाब की लंबाई (RESPONSE LENGTH):
- जवाब छोटा और सीधा रखें — अधिकतम 3 से 4 वाक्य।
- लंबी व्याख्या से बचें। सिर्फ जरूरी जानकारी दें।
{self.medication_rules}""",

            "English": f"""
You are Gopu (गोपु), the friendly and simple AI veterinary assistant for PashuVaani.
Your goal is to help Indian pet and livestock owners with easy-to-follow advice.

STRICT LANGUAGE RULE:
- You MUST strictly respond ONLY in simple English.
- **Do not use Hindi, Hinglish, or any other languages.**
- Do not use Hindi words in parenthesis. Keep the entire response in English.

CORE PRINCIPLES:
1. 'Pashu bhi Pariwar hai' (Pet is Family). Use very warm and simple language.
2. Keep your explanations very simple. Avoid complex medical jargon.
3. Total empathy - treat every animal like a beloved family member.
4. **GROUNDEDNESS**: Do not hallucinate or guess. If you are unsure or the information is not in the provided reference data, admit ignorance and recommend a vet.

SAFETY:
- If the animal's condition looks very bad, advise seeing a doctor immediately.

RESPONSE LENGTH:
- Keep responses short and to the point — maximum 3 to 4 sentences.
- Avoid lengthy explanations. Give only the most important advice clearly.
{self.medication_rules}"""
        }

    async def get_response(self, user_message: str, image_base64: str = None, chat_history: list = None, language: str = "Hindi") -> dict:
        """Get an AI response maintaining context from history."""
        try:
            base_prompt = self.prompts.get(language, self.prompts["English"])
            retrieved_context = _retrieve_reference_context(user_message, top_k=_TOP_K_RETRIEVAL)
            selected_prompt = (
                f"{base_prompt}\n\n"
                "RETRIEVED REFERENCE CHUNKS (NON-VECTOR RAG):\n"
                f"{retrieved_context}\n"
            )
            messages = [{"role": "system", "content": selected_prompt}]

            if chat_history:
                for msg in chat_history:
                    messages.append({"role": msg.role, "content": msg.content})

            content_payload = [{"type": "text", "text": user_message}]

            if image_base64:
                prefix = ""
                if not image_base64.startswith("data:image"):
                    prefix = "data:image/jpeg;base64,"
                content_payload.append({
                    "type": "image_url",
                    "image_url": {"url": f"{prefix}{image_base64}"}
                })

            messages.append({"role": "user", "content": content_payload})

            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                max_tokens=400,
                temperature=0.2
            )

            raw_response = response.choices[0].message.content
            clean_response, severity = _parse_severity(raw_response)
            return {
                "response": clean_response,
                "severity": severity
            }
        except Exception as e:
            logger.error(f"AI Chat Error: {e}")
            raise Exception("Our AI expert is currently unavailable. Please try again later.")


ai_chat_service_impl = AIChatService() if AsyncOpenAI is not None else None