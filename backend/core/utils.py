import traceback
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import django

django.setup()








def send_otp_email(recipient_email:str, otp_code: str, user_name="User"):
    subject = "Ledgerly OTP Verification Code"
    template_name= "emails/otp_verification.html"
    context={
        'otp_code': otp_code,
        'user_name': user_name,
        'domain': 'estatewebng.com' if not settings.DEBUG else 'localhost:8000',
        'protocol': 'https' if not settings.DEBUG else 'http'
    }
    
    try:
        html_content= render_to_string(template_name, context)
        
        txt_template_name= template_name.replace('.html', '.txt')
        try:
            text_content = render_to_string(txt_template_name, context)
        except Exception:
            text_content = strip_tags(html_content)

        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient_email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send(fail_silently=False)
        print("OTP Sent Successfully")
        return True

    except Exception as e:
        print("An error occured")
        #TODO implement the error tracking
        # ErrorLog.objects.create(
        #     traceback=f"Email Error ({subject}) to {recipient_email}: {str(e)}\n{traceback.format_exc()}"
        # )
        return False