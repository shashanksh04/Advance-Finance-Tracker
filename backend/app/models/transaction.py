import uuid
from sqlalchemy import Column, String, DateTime, func, ForeignKey, Date, Text, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    transaction_date = Column(Date, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    note = Column(Text, nullable=True)
    category = Column(String(100), nullable=False)
    credit = Column(Numeric(12, 2), default=0)
    debit = Column(Numeric(12, 2), default=0)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="transactions")
