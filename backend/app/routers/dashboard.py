from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from datetime import date, timedelta
from typing import List, Dict

from ..database import get_db
from ..models.user import User
from ..models.transaction import Transaction
from ..utils.jwt_handler import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
async def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    today = date.today()
    current_month_start = today.replace(day=1)

    # Total income and expenses for the current month
    income_result = await db.execute(
        select(func.sum(Transaction.credit))
        .where(and_(Transaction.user_id == current_user.id, Transaction.transaction_date >= current_month_start))
    )
    total_income = float(income_result.scalar_one_or_none() or 0.0)

    expenses_result = await db.execute(
        select(func.sum(Transaction.debit))
        .where(and_(Transaction.user_id == current_user.id, Transaction.transaction_date >= current_month_start))
    )
    total_expenses = float(expenses_result.scalar_one_or_none() or 0.0)

    net_balance = total_income - total_expenses

    # Category-wise expenses for the current month
    category_expenses_result = await db.execute(
        select(Transaction.category, func.sum(Transaction.debit))
        .where(and_(Transaction.user_id == current_user.id, Transaction.transaction_date >= current_month_start, Transaction.debit > 0))
        .group_by(Transaction.category)
    )
    category_expenses = {cat: float(total) for cat, total in category_expenses_result.all()}

    # Monthly expenses for the past 12 months
    twelve_months_ago = (today - timedelta(days=365)).replace(day=1)
    monthly_expenses_result = await db.execute(
        select(
            func.to_char(Transaction.transaction_date, 'YYYY-MM').label('month'),
            func.sum(Transaction.debit).label('total')
        )
        .where(and_(Transaction.user_id == current_user.id, Transaction.transaction_date >= twelve_months_ago, Transaction.debit > 0))
        .group_by('month')
        .order_by('month')
    )
    monthly_expenses = [{"month": row.month, "total": float(row.total)} for row in monthly_expenses_result.all()]

    return {
        "total_income": float(total_income),
        "total_expenses": float(total_expenses),
        "net_balance": float(net_balance),
        "category_expenses": category_expenses,
        "monthly_expenses": monthly_expenses,
    }
