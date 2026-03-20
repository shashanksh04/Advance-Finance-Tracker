from pydantic import BaseModel, ConfigDict, field_serializer
from uuid import UUID
from datetime import datetime, date
from typing import Optional
from decimal import Decimal

class TransactionBase(BaseModel):
    transaction_date: date
    title: str
    note: Optional[str] = None
    category: str
    credit: Decimal
    debit: Decimal

    @field_serializer('credit', 'debit')
    def serialize_decimal(self, decimal_value: Decimal, _info):
        return float(decimal_value)

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(TransactionBase):
    transaction_date: Optional[date] = None
    title: Optional[str] = None
    category: Optional[str] = None
    credit: Optional[Decimal] = None
    debit: Optional[Decimal] = None

class TransactionOut(TransactionBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
