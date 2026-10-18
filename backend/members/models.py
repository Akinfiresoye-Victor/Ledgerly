from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    def __str__(self):
        return f'{self.username}'

#TODO Change this to Token Authentication