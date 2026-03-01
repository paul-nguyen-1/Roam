from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.flow import Flow
from app.models.run import Run, StepResult
from app.agent.runner import run_flow
from datetime import datetime
import uuid

router = APIRouter(prefix="/runs", tags=["runs"])


@router.post("/{flow_id}")
async def trigger_run(flow_id: str, db: Session = Depends(get_db)):
    flow = db.query(Flow).filter(Flow.id == flow_id).first()
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")

    run = Run(
        id=uuid.uuid4(),
        flow_id=flow.id,
        status="running",
        started_at=datetime.utcnow()
    )
    db.add(run)
    db.commit()

    try:
        step_results = await run_flow(flow.url, flow.steps)
    except Exception as e:
        run.status = "failed"
        run.completed_at = datetime.utcnow()
        db.commit()
        raise HTTPException(status_code=500, detail=f"Agent crashed: {str(e)}")

    for s in step_results:
        step = StepResult(
            id=uuid.uuid4(),
            run_id=run.id,
            step_index=s["step_index"],
            step_text=s["step_text"],
            status=s["status"],
            action=s["action"],
            screenshot=s["screenshot"],
            error=s["error"]
        )
        db.add(step)

    all_passed = all(s["status"] == "passed" for s in step_results)
    run.status = "passed" if all_passed else "failed"
    run.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(run)

    return {
        "run_id": str(run.id),
        "status": run.status,
        "started_at": run.started_at,
        "completed_at": run.completed_at,
        "steps": step_results
    }


@router.get("/{run_id}")
def get_run(run_id: str, db: Session = Depends(get_db)):
    run = db.query(Run).filter(Run.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    steps = (
        db.query(StepResult)
        .filter(StepResult.run_id == run_id)
        .order_by(StepResult.step_index)
        .all()
    )

    return {
        "id": str(run.id),
        "flow_id": str(run.flow_id),
        "status": run.status,
        "started_at": run.started_at,
        "completed_at": run.completed_at,
        "steps": [
            {
                "id": str(s.id),
                "step_index": s.step_index,
                "step_text": s.step_text,
                "status": s.status,
                "action": s.action,
                "screenshot": s.screenshot,
                "error": s.error,
            }
            for s in steps
        ]
    }
