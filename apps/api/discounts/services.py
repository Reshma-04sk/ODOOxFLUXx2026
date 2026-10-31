from decimal import Decimal
from django.utils import timezone
from django.db import transaction
from .models import Discount, DiscountRedemption
from common.money import round_money
from common.exceptions import BusinessLogicError


class DiscountService:
    @classmethod
    def validate_discount(cls, code: str, customer, subtotal: Decimal) -> tuple[Discount, Decimal]:
        if not code:
            raise BusinessLogicError("Discount code must be provided.")

        clean_code = code.upper().strip()
        try:
            discount = Discount.objects.get(code=clean_code)
        except Discount.DoesNotExist:
            raise BusinessLogicError("Invalid discount code.")

        now = timezone.now()
        if not discount.is_active:
            raise BusinessLogicError("This discount code is inactive.")

        if now < discount.valid_from:
            raise BusinessLogicError("This discount code is not yet valid.")

        if now > discount.valid_until:
            raise BusinessLogicError("This discount code has expired.")

        if discount.max_redemptions is not None and discount.times_redeemed >= discount.max_redemptions:
            raise BusinessLogicError("This discount code has reached its maximum redemptions limit.")

        subtotal_dec = round_money(subtotal)
        if subtotal_dec < discount.min_subtotal:
            raise BusinessLogicError(
                f"Minimum invoice subtotal of ₹{discount.min_subtotal:,.2f} is required for this discount."
            )

        # Calculate discount amount
        discount_amount = cls.calculate_discount(discount, subtotal_dec)
        return discount, discount_amount

    @classmethod
    def calculate_discount(cls, discount: Discount, subtotal: Decimal) -> Decimal:
        subtotal_dec = round_money(subtotal)
        if discount.discount_type == Discount.DiscountType.PERCENTAGE:
            pct = discount.value / Decimal("100.0")
            raw_discount = subtotal_dec * pct
        else:
            raw_discount = discount.value

        # Cap discount at subtotal to prevent negative invoice totals
        capped = min(raw_discount, subtotal_dec)
        return round_money(capped)

    @classmethod
    @transaction.atomic
    def record_redemption(cls, discount: Discount, customer, invoice, discount_amount: Decimal) -> DiscountRedemption:
        if invoice and DiscountRedemption.objects.filter(discount=discount, customer=customer, invoice=invoice).exists():
            raise BusinessLogicError("Discount has already been applied to this invoice.")

        redemption = DiscountRedemption.objects.create(
            discount=discount,
            customer=customer,
            invoice=invoice,
            discount_amount=round_money(discount_amount),
        )
        discount.times_redeemed += 1
        discount.save(update_fields=["times_redeemed", "updated_at"])
        return redemption
