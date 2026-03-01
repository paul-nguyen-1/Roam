from sqlalchemy import Column, String, JSON, DateTime, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import uuid

class Run(Base):
    __tablename__ = "runs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    flow_id = Column(UUID(as_uuid=True), ForeignKey("flows.id"), nullable=False)
    status = Column(String, nullable=False, default="pending")
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    flow = relationship("Flow", back_populates="runs")
    step_results = relationship("StepResult", back_populates="run", cascade="all, delete-orphan", order_by="StepResult.step_index")


class StepResult(Base):
    __tablename__ = "step_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    run_id = Column(UUID(as_uuid=True), ForeignKey("runs.id"), nullable=False)
    step_index = Column(Integer, nullable=False)
    step_text = Column(String, nullable=False)
    status = Column(String, nullable=False)
    action = Column(JSON, nullable=True)
    screenshot = Column(Text, nullable=True)
    error = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    run = relationship("Run", back_populates="step_results")
