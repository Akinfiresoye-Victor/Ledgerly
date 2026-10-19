from django.db import models
from django.conf import settings
from core.choices import CURRENCY

# Create your models here.

class Business(models.Model):
    owner= models.ForeignKey(settings.AUTH_USER_MODEL, on_delete= models.CASCADE)
    name= models.CharField(max_length=100, blank=False, null=False)
    currency= models.CharField(max_length=10, choices= CURRENCY ,blank=False, null=False, default= "NGN" )