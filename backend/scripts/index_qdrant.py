#!/usr/bin/env python3
"""One-shot indexer: vet_reference JSON → Qdrant (dense OpenAI embeddings + BM25 sparse vectors)."""

from __future__ import annotations

import argparse
import logging
import sys
import uuid
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from openai import OpenAI
from qdrant_client.models import PointStruct

from app.core.config import settings
from app.services.reference_chunks import iter_reference_chunks
from app.services.qdrant_rag import (
    _embed_sparse_document,
    _get_sparse_model,
    _qdrant_client,
    _sparse_to_qdrant,
    ensure_collection_exists_sync,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _point_uuid(chunk_id: str) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f"pashuvaani:vet:{chunk_id}"))


def main() -> None:
    parser = argparse.ArgumentParser(description="Index vet_reference into Qdrant.")
    parser.add_argument("--recreate", action="store_true", help="Delete collection before indexing.")
    args = parser.parse_args()

    if _get_sparse_model() is None:
        raise SystemExit("fastembed is required for sparse vectors.")

    client = _qdrant_client()
    if client is None:
        raise SystemExit("QDRANT_URL is not set or Qdrant is unreachable.")

    if args.recreate:
        try:
            client.delete_collection(collection_name=settings.QDRANT_COLLECTION)
            logger.info("Deleted collection %s", settings.QDRANT_COLLECTION)
        except Exception as e:
            logger.warning("Could not delete collection: %s", e)

    ensure_collection_exists_sync()

    oai = OpenAI(api_key=settings.OPENAI_API_KEY)

    rows: list[tuple[str, dict]] = list(iter_reference_chunks())
    if not rows:
        raise SystemExit("No reference chunks found under backend/data/vet_reference.")

    batch_size = 32
    for i in range(0, len(rows), batch_size):
        batch = rows[i : i + batch_size]
        texts = [p["text"] for _, p in batch]
        emb_resp = oai.embeddings.create(model=settings.EMBEDDING_MODEL, input=texts)
        if len(emb_resp.data) != len(batch):
            raise RuntimeError("Embedding batch size mismatch")

        batch_points: list[PointStruct] = []
        for ((cid, payload), emb_rec) in zip(batch, emb_resp.data):
            dense = list(emb_rec.embedding)
            sparse_raw = _embed_sparse_document(payload["text"])
            if sparse_raw is None:
                raise RuntimeError("Sparse embedding failed")
            sparse_vec = _sparse_to_qdrant(sparse_raw)
            pid = _point_uuid(cid)
            pl = dict(payload)
            pl["chunk_id"] = cid
            batch_points.append(
                PointStruct(
                    id=pid,
                    vector={"dense": dense, "sparse": sparse_vec},
                    payload=pl,
                )
            )

        logger.info("Upserting batch %s-%s", i, i + len(batch))
        client.upsert(collection_name=settings.QDRANT_COLLECTION, points=batch_points)

    logger.info("Indexed %s chunks into %s", len(rows), settings.QDRANT_COLLECTION)


if __name__ == "__main__":
    main()
