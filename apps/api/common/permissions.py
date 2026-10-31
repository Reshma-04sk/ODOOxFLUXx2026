from rest_framework import permissions
from rest_framework.exceptions import NotFound

class IsStaffOrReadOnly(permissions.BasePermission):
    """Allows read access to any authenticated user, write access only to staff/admin."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser))


class IsCustomerOrStaff(permissions.BasePermission):
    """
    Enforces customer isolation.
    Staff members can view/manage all records.
    Normal customer accounts can only view/manage records belonging to their own Customer entity.
    Unauthorized cross-tenant access triggers an immediate NotFound (HTTP 404).
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False

        if request.user.is_staff or request.user.is_superuser:
            return True

        # Check tenant ownership on the object
        customer = getattr(request.user, "customer_profile", None)
        if not customer:
            raise NotFound(detail="Customer profile not found.")

        # Determine target customer for object
        obj_customer = None
        if hasattr(obj, "customer"):
            obj_customer = obj.customer
        elif hasattr(obj, "user"):
            obj_customer = getattr(obj.user, "customer_profile", None)
        elif hasattr(obj, "id") and obj.__class__.__name__ == "Customer":
            obj_customer = obj

        if obj_customer is not None and obj_customer.id == customer.id:
            return True

        # Return 404 instead of 403 to prevent enumeration attacks
        raise NotFound(detail="Resource not found.")
