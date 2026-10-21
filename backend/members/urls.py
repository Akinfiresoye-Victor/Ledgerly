from django.urls import path
from .views import LoginView, LogoutView, ProtectedProfileView, RegistrationView

urlpatterns = [
    path('register/', RegistrationView.as_view(), name='api_register'),
    path('login/', LoginView.as_view(), name='api_login'),
    path('profile/', ProtectedProfileView.as_view(), name='api_profile'),
    path('logout/', LogoutView.as_view(), name='api_logout'),
]
