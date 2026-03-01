from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.flows import router as flows_router
from app.api.runs import router as runs_router
from app.database import Base, engine
import app.models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Roam API",
    description="AI-powered end-to-end testing agent",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(flows_router)
app.include_router(runs_router)


@app.get("/health")
def health():
    return {"status": "ok"}
