from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

class User(AbstractUser):
    def __str__(self):
        return self.username




#Signal for creating a unique token for each user that has been created 
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
#Recieve the signal and generate the token...
def create_auth_token(sender, instance=None, created=False, **kwargs):
    """
    instance - is the actual user
    crated- guide to check if its a new user to prevent extra keys...
    """
    if created:
        Token.objects.create(user=instance)
