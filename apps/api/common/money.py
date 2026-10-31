"""
PlanLedger Money & Financial Calculation Utilities
Enforces Python Decimal, ROUND_HALF_UP, and INR currency conventions.
"""

from decimal import Decimal, ROUND_HALF_UP

CURRENCY_INR = "INR"
CURRENCY_SYMBOL = "₹"
TWO_PLACES = Decimal("0.01")


def round_money(amount: Decimal | float | int | str) -> Decimal:
    """
    Rounds a monetary amount to 2 decimal places using standard ROUND_HALF_UP.
    Guarantees returning a Decimal instance.
    """
    if amount is None:
        return Decimal("0.00")
    if not isinstance(amount, Decimal):
        amount = Decimal(str(amount))
    return amount.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)


def format_inr(amount: Decimal | float | int | str) -> str:
    """Formats a decimal amount as INR string, e.g. ₹1,499.00"""
    dec = round_money(amount)
    return f"{CURRENCY_SYMBOL}{dec:,.2f}"
