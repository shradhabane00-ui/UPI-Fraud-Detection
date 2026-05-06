"""Production entrypoint for the FastAPI app.

CRITICAL: This file must NOT change any existing routes or ML/business logic.
It only provides:
- a /health route
- safer model/data loading paths
- production-friendly startup

The existing API implementation lives in backend/api.py.
"""

from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import the existing app and all routes/logic.
# This keeps full backward compatibility.
import backend.api as api_module


def _apply_cwd_safely() -> None:
    """Ensure model/scoring artifacts can be loaded with relative paths.

    backend/api.py currently uses relative paths like:
      joblib.load("backend/lr_model.pkl")
      pd.read_csv("risk_analysis.csv")

    In some platforms (Render), the working directory may differ.
    We do NOT change ML logic; we only align the working directory.
    """

    repo_root = Path(__file__).resolve().parent.parent
    model_dir = os.getenv("MODEL_DIR")
    data_csv = os.getenv("DATA_CSV")

    # If user explicitly sets locations, we symlink/copy via cwd approach is risky.
    # Safer approach: set cwd to repo root so backend/api.py relative paths resolve.
    # Provide env vars only as documentation; we keep cwd approach for compatibility.
    _ = model_dir
    _ = data_csv

    os.chdir(repo_root)


_apply_cwd_safely()

app: FastAPI = api_module.app  # reuse the existing configured FastAPI instance


# Add/ensure CORS middleware (non-destructive).
# backend/api.py already adds permissive CORS; adding again could be redundant.
# We keep this minimal: only tighten origins if explicitly provided.
_cors_origins = os.getenv("CORS_ALLOW_ORIGINS", "").strip()
if _cors_origins:
    allowed = [o.strip() for o in _cors_origins.split(",") if o.strip()]
    # Remove cannot be done safely; instead add another middleware.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get("/health")
def health() -> dict:
    """Render/Vercel health check endpoint."""

    return {"status": "ok"}

