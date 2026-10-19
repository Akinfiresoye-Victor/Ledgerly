from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token

User = get_user_model()

class AuthAPITests(APITestCase):

    def setUp(self):
        # We still keep a pre-existing user for testing profile and logout
        self.user = User.objects.create_user(
            username="testuser",
            password="SecurePassword123!"
        )

    def test_user_registration(self):
        """Test that a new user can register successfully via the API."""
        url = reverse('api_register')  # Ensure your register URL name matches this
        data = {
            "username": "newuser",
            "password": "NewUserPassword123!",
            "email": "newuser@example.com"
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        registered_user = User.objects.get(username="newuser")
        self.assertTrue(registered_user.check_password(data["password"]))
        self.assertEqual(
            response.data["token"],
            Token.objects.get(user=registered_user).key,
        )

    def test_user_login(self):
        """Test that an existing user can log in and receive a token."""
        url = reverse('api_login')  # Ensure your login URL name matches this
        data = {
            "username": "testuser",
            "password": "SecurePassword123!"
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_protected_profile(self):
        """Test that an authenticated user can access their profile."""
        self.client.force_authenticate(user=self.user)
        url = reverse('api_profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

    def test_user_logout(self):
        """Test that an authenticated user can log out by deleting their token."""
        # Use get_or_create to prevent duplicate token creation errors
        token, _ = Token.objects.get_or_create(user=self.user)

        # Authenticate using the token (simulating header: Token <key>)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        url = reverse('api_logout')
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the token has been deleted from the database
        self.assertFalse(Token.objects.filter(key=token.key).exists())
