from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.flow import Flow
from app.models.run import Run
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter(prefix="/flows", tags=["flows"])


class FlowCreate(BaseModel):
    name: str
    url: str
    steps: list[str]


class FlowUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    steps: Optional[list[str]] = None


@router.post("/")
def create_flow(body: FlowCreate, db: Session = Depends(get_db)):
    flow = Flow(
        id=uuid.uuid4(),
        name=body.name,
        url=body.url,
        steps=body.steps
    )
    db.add(flow)
    db.commit()
    db.refresh(flow)
    return flow


@router.get("/")
def list_flows(db: Session = Depends(get_db)):
    return db.query(Flow).order_by(Flow.created_at.desc()).all()


@router.get("/{flow_id}")
def get_flow(flow_id: str, db: Session = Depends(get_db)):
    flow = db.query(Flow).filter(Flow.id == flow_id).first()
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    return flow


@router.patch("/{flow_id}")
def update_flow(flow_id: str, body: FlowUpdate, db: Session = Depends(get_db)):
    flow = db.query(Flow).filter(Flow.id == flow_id).first()
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")

    if body.name is not None:
        flow.name = body.name
    if body.url is not None:
        flow.url = body.url
    if body.steps is not None:
        flow.steps = body.steps

    db.commit()
    db.refresh(flow)
    return flow


@router.delete("/{flow_id}")
def delete_flow(flow_id: str, db: Session = Depends(get_db)):
    flow = db.query(Flow).filter(Flow.id == flow_id).first()
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    db.delete(flow)
    db.commit()
    return {"deleted": True}


@router.get("/{flow_id}/runs")
def get_flow_runs(flow_id: str, db: Session = Depends(get_db)):
    flow = db.query(Flow).filter(Flow.id == flow_id).first()
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    return db.query(Run).filter(Run.flow_id == flow_id).order_by(Run.created_at.desc()).all()
