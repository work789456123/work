"""Hybrid dense + sparse (BM25) retrieval via Qdrant with local JSON fallback."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from app.core.config import settings
from app.services.reference_fallback import retrieve_fallback_context

logger = logging.getLogger(__name__)

try:
    from qdrant_client import QdrantClient
    from qdrant_client.models import (
        Distance,
        Fusion,
        FusionQuery,
        PointStruct,
        Prefetch,
        SparseVector,
        SparseVectorParams,
        VectorParams,
    )

    _QDRANT_AVAILABLE = True
except ImportError:  # pragma: no cover
    QdrantClient = None  # type: ignore[misc, assignment]
    _QDRANT_AVAILABLE = False

try:
    from fastembed import SparseTextEmbedding

    _FASTEMBED_AVAILABLE = True
except ImportError:  # pragma: no cover
    SparseTextEmbedding = None  # type: ignore[misc, assignment]
    _FASTEMBED_AVAILABLE = False

_sparse_model: Any = None


def _get_sparse_model() -> Any:
    global _sparse_model
    if not _FASTEMBED_AVAILABLE:
        return None
    if _sparse_model is None:
        _sparse_model = SparseTextEmbedding(model_name="Qdrant/bm25")
    return _sparse_model


def _sparse_to_qdrant(sparse_emb: Any) -> SparseVector:
    if hasattr(sparse_emb, "indices") and hasattr(sparse_emb, "values"):
        return SparseVector(indices=list(sparse_emb.indices), values=list(sparse_emb.values))
    if isinstance(sparse_emb, dict):
        return SparseVector(indices=list(sparse_emb["indices"]), values=list(sparse_emb["values"]))
    # fastembed may return dataclass-like
    idx = getattr(sparse_emb, "indices", None)
    val = getattr(sparse_emb, "values", None)
    if idx is not None and val is not None:
        return SparseVector(indices=list(idx), values=list(val))
    raise TypeError(f"Unsupported sparse embedding type: {type(sparse_emb)}")


def _qdrant_client() -> Any | None:
    if not _QDRANT_AVAILABLE or not settings.QDRANT_URL.strip():
        return None
    kwargs: dict[str, Any] = {"url": settings.QDRANT_URL.strip()}
    if settings.QDRANT_API_KEY:
        kwargs["api_key"] = settings.QDRANT_API_KEY
    try:
        return QdrantClient(**kwargs)
    except Exception as e:  # pragma: no cover
        logger.warning("Qdrant client init failed: %s", e)
        return None


async def _embed_dense(openai_client: Any, text: str) -> list[float]:
    resp = await openai_client.embeddings.create(
        model=settings.EMBEDDING_MODEL,
        input=[text],
    )
    return list(resp.data[0].embedding)


def _embed_sparse_document(text: str) -> Any:
    model = _get_sparse_model()
    if model is None:
        return None
    gen = model.embed([text])
    return next(iter(gen))


def _embed_sparse_query(text: str) -> Any:
    model = _get_sparse_model()
    if model is None:
        return None
    gen = model.query_embed([text])
    return next(iter(gen))


async def retrieve_reference_context_async(
    user_message: str,
    openai_client: Any,
    top_k: int | None = None,
) -> str:
    """Hybrid RRF search when Qdrant + deps are available; else keyword fallback."""
    k = top_k if top_k is not None else settings.RAG_TOP_K
    if not settings.USE_QDRANT_RAG:
        return retrieve_fallback_context(user_message, top_k=k)

    client = _qdrant_client()
    if client is None or openai_client is None:
        return retrieve_fallback_context(user_message, top_k=k)

    sparse_model = _get_sparse_model()
    if sparse_model is None:
        logger.warning("FastEmbed unavailable; using keyword fallback.")
        return retrieve_fallback_context(user_message, top_k=k)

    try:
        dense = await _embed_dense(openai_client, user_message)
        sq = _embed_sparse_query(user_message)
        if sq is None:
            return retrieve_fallback_context(user_message, top_k=k)
        sparse_vec = _sparse_to_qdrant(sq)

        prefetch_limit = max(k * 3, 20)
        points = client.query_points(
            collection_name=settings.QDRANT_COLLECTION,
            prefetch=[
                Prefetch(query=dense, using="dense", limit=prefetch_limit),
                Prefetch(query=sparse_vec, using="sparse", limit=prefetch_limit),
            ],
            query=FusionQuery(fusion=Fusion.RRF),
            limit=k,
            with_payload=True,
        )

        docs: list[str] = []
        for p in points.points or []:
            pl = p.payload or {}
            txt = pl.get("text")
            if txt:
                docs.append(str(txt))

        if not docs:
            return retrieve_fallback_context(user_message, top_k=k)
        return "\n---\n".join(docs)
    except Exception as e:
        logger.warning("Qdrant hybrid retrieval failed: %s", e)
        return retrieve_fallback_context(user_message, top_k=k)


def _retrieve_reference_context(user_message: str, top_k: int | None = None) -> str:
    """Sync API for tests (no running event loop)."""
    try:
        asyncio.get_running_loop()
    except RuntimeError:
        pass
    else:  # pragma: no cover
        raise RuntimeError("Use retrieve_reference_context_async inside async code")

    from openai import AsyncOpenAI

    if AsyncOpenAI is None:
        return retrieve_fallback_context(user_message, top_k=top_k or settings.RAG_TOP_K)

    async def _run() -> str:
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        try:
            return await retrieve_reference_context_async(
                user_message, client, top_k=top_k
            )
        finally:
            await client.close()

    return asyncio.run(_run())


def ensure_collection_exists_sync() -> None:
    """Used by index script: create collection if missing."""
    if not _QDRANT_AVAILABLE:
        raise RuntimeError("qdrant-client not installed")
    client = _qdrant_client()
    if client is None:
        raise RuntimeError("QDRANT_URL not set")

    name = settings.QDRANT_COLLECTION
    exists = False
    try:
        client.get_collection(name)
        exists = True
    except Exception:
        exists = False

    if exists:
        return

    client.create_collection(
        collection_name=name,
        vectors_config={"dense": VectorParams(size=settings.EMBEDDING_DIM, distance=Distance.COSINE)},
        sparse_vectors_config={"sparse": SparseVectorParams()},
    )


def upsert_points_sync(points: list[PointStruct]) -> None:
    client = _qdrant_client()
    if client is None:
        raise RuntimeError("QDRANT_URL not set")
    client.upsert(collection_name=settings.QDRANT_COLLECTION, points=points)
