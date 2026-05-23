from django.http import JsonResponse

def health(request):
    """Simple health-check endpoint.
    Returns a JSON payload confirming the backend is up.
    This view is hooked to the root URL ('/') in config/urls.py.
    """
    return JsonResponse({
        "status": "ok",
        "message": "JobPortal backend is running",
    })
