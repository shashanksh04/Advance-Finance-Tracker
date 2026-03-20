from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from datetime import date, timedelta
from typing import List
from uuid import UUID

from ..database import get_db
from ..models.user import User
from ..models.transaction import Transaction
from ..schemas.transaction import TransactionCreate, TransactionOut, TransactionUpdate
from ..utils.jwt_handler import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])

def get_date_range(range_str: str):
    today = date.today()
    if range_str == "current_month":
        start_date = today.replace(day=1)
        return start_date, today
    if range_str == "last_3_months":
        start_date = (today - timedelta(days=90)).replace(day=1)
        return start_date, today
    if range_str == "last_6_months":
        start_date = (today - timedelta(days=180)).replace(day=1)
        return start_date, today
    if range_str == "last_1_year":
        start_date = today.replace(year=today.year - 1)
        return start_date, today
    if range_str == "last_2_years":
        start_date = today.replace(year=today.year - 2)
        return start_date, today
    if range_str == "last_5_years":
        start_date = today.replace(year=today.year - 5)
        return start_date, today
    return today.replace(day=1), today # Default to current month

@router.get("/", response_model=List[TransactionOut])
async def get_transactions(
    range: str = Query("current_month", enum=["current_month", "last_3_months", "last_6_months", "last_1_year", "last_2_years", "last_5_years"]),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    start_date, end_date = get_date_range(range)
    result = await db.execute(
        select(Transaction)
        .where(
            and_(
                Transaction.user_id == current_user.id,
                Transaction.transaction_date >= start_date,
                Transaction.transaction_date <= end_date,
            )
        )
        .order_by(Transaction.transaction_date.desc())
    )
    return result.scalars().all()

@router.post("/", response_model=TransactionOut, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    transaction_data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_transaction = Transaction(**transaction_data.model_dump(), user_id=current_user.id)
    db.add(new_transaction)
    await db.commit()
    await db.refresh(new_transaction)
    return new_transaction

@router.put("/{transaction_id}", response_model=TransactionOut)
async def update_transaction(
    transaction_id: UUID,
    transaction_data: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Transaction).where(Transaction.id == transaction_id))
    transaction = result.scalars().first()

    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    if transaction.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this transaction")

    for key, value in transaction_data.model_dump(exclude_unset=True).items():
        setattr(transaction, key, value)

    await db.commit()
    await db.refresh(transaction)
    return transaction

@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(
    transaction_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Transaction).where(Transaction.id == transaction_id))
    transaction = result.scalars().first()

    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    if transaction.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this transaction")

    await db.delete(transaction)
    await db.commit()
    return
