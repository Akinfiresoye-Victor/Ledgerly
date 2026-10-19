# Change this import:
# BAD: from django.test import TestCase
# GOOD:
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status

User = get_user_model()

# Inherit from APITestCase instead of TestCase
class AuthAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="SecurePassword123!"
        )

    def test_protected_profile(self):
        # Now self.client will be rest_framework.test.APIClient
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('api_profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)