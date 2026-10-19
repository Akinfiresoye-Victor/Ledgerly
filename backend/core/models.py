from django.db import models
from django.conf import settings
from .choices import TRANSACTIONTYPE, CATEGORY_CHOICES, PAYMENT_STATUS, FILE_KIND, FILE_STATUS
from django.utils import timezone
from .validators import validate_file



class Document(models.Model):
    buisness= models.ForeignKey(settings.AUTH_USER_MODEL, on_delete= models.CASCADE)
    file= models.FileField(upload_to="documents/", validators=[validate_file], null=True, blank=True)
    file_kind= models.CharField(max_length= 15, choices= FILE_KIND, blank=False, null=False, default= "other")
    status= models.CharField(max_length= 15, choices= FILE_STATUS)
    uploaded_time= models.DateTimeField(auto_now_add= True)
    raw_extraction= models.TextField(blank= True, null= True)
    def __str__(self):
        return f"{self.buisness.name} - {self.file_kind}"
        



class Transaction(models.Model):
    buisness= models.ForeignKey(settings.AUTH_USER_MODEL, on_delete= models.CASCADE)
    document=models.ForeignKey(Document, on_delete= models.CASCADE)
    transaction_type= models.CharField(max_length= 10, choices=TRANSACTIONTYPE, default=None)
    category= models.CharField(max_length= 50, choices= CATEGORY_CHOICES, default="OTHER", null=False, blank=False)
    subcategory= models.CharField(max_length= 50, blank= True, null= True)
    counterparty= models.CharField(max_length= 50, blank= True, null= True)
    date= models.DateField(default= timezone.now)
    payment_status= models.CharField(max_length= 10, choices= PAYMENT_STATUS)
    amount= models.DecimalField(max_digits= 15, decimal_places= 2)
    needs_review= models.BooleanField(default= False)
    confidence_score= models.FloatField()
    confirmed= models.BooleanField(default= False)
    def __str__(self):
        return f"{self.buisness.name} - {self.date} - {self.category}"


