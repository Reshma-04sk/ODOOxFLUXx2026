from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException, PermissionDenied, NotFound
from rest_framework import status


class InvalidStateTransitionError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Invalid state transition requested."
    default_code = "invalid_state_transition"


class BusinessLogicError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "A business logic constraint was violated."
    default_code = "business_logic_error"


def custom_exception_handler(exc, context):
    """
    Custom DRF exception handler providing uniform error response envelopes:
    {
        "error": {
            "code": "error_code",
            "message": "Human readable summary",
            "details": {...}
        }
    }
    """
    response = exception_handler(exc, context)

    if response is not None:
        code = getattr(exc, "default_code", "error")
        if hasattr(exc, "get_codes"):
            codes = exc.get_codes()
            if isinstance(codes, str):
                code = codes
            elif isinstance(codes, dict) and "code" in codes:
                code = codes["code"]

        message = str(exc)
        if hasattr(exc, "detail"):
            if isinstance(exc.detail, str):
                message = exc.detail
            elif isinstance(exc.detail, list) and exc.detail:
                message = str(exc.detail[0])
            elif isinstance(exc.detail, dict):
                first_key = next(iter(exc.detail))
                first_val = exc.detail[first_key]
                if isinstance(first_val, list) and first_val:
                    message = f"{first_key}: {first_val[0]}"
                else:
                    message = f"{first_key}: {first_val}"

        response.data = {
            "error": {
                "code": code,
                "message": message,
                "details": response.data if isinstance(response.data, (dict, list)) else None,
            }
        }

    return response
