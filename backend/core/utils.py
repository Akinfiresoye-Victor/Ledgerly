import json
import logging

import resend
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST




logger = logging.getLogger(__name__)


@csrf_exempt
@require_POST
def send_email(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid request body"}, status=400)

    to = body.get("to")
    subject = body.get("subject")
    message = body.get("message")

    if not all([to, subject, message]):
        return JsonResponse(
            {"error": "Missing required fields: to, subject, message"}, status=400
        )

    try:
        result = resend.Emails.send(
            {
                "from": settings.EMAIL_FROM,
                "to": [to],
                "subject": subject,
                "html": f"<p>{message}</p>",
            }
        )
        return JsonResponse({"success": True, "id": result["id"]})
    except Exception:
        logger.exception("Error sending email")
        return JsonResponse({"error": "Failed to send email"}, status=500)