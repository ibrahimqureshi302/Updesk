from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    """Return all errors in a consistent { success, error } shape."""
    response = exception_handler(exc, context)
    if response is not None:
        response.data = {
            "success": False,
            "error": {
                "status_code": response.status_code,
                "detail":      response.data,
            }
        }
    return response
