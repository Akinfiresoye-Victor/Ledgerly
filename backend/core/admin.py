from django.contrib import admin
from .models import Document, Transaction
from members.models import User



admin.site.register([User, Document, Transaction])
