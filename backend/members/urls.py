from django.urls import path
from .views import LoginView, ProtectedProfileView

urlpatterns = [
    path('api/login/', LoginView.as_view(), name='api_login'),
    path('api/profile/', ProtectedProfileView.as_view(), name='api_profile'),
]
