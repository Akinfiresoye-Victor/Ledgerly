from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()

class LoginView(APIView):
    # This view does not require authentication thats why the list is empty
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            # get_or_create ensures a token exists even if signal was skipped
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_400_BAD_REQUEST
        )


#Used to check if who is who and block unauthorized users
class ProtectedProfileView(APIView):
    #This then checks if the user is actually authenticated
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # request.user is automatically populated by TokenAuthentication
        # request.user.is_authenticated is True
        return Response({
            'username': request.user.username,
            'is_authenticated': request.user.is_authenticated,
        })


class RegistrationView(APIView):
    # Anyone can register, so authentication and permissions are disabled
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')

        # Basic validation to ensure fields are provided
        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if username is already taken
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username is already taken.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the user using Django's built-in manager which handles password hashing
        user = User.objects.create_user(username=username, password=password, email=email)

        # Generate an authentication token for the newly created user
        token, _ = Token.objects.get_or_create(user=user)

        # Return success response with the token
        return Response({
            'token': token.key,
            'username': user.username
        }, status=status.HTTP_201_CREATED)


class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Delete the user's token to invalidate their session
        request.auth.delete()
        return Response(
            {"message": "Successfully logged out."},
            status=status.HTTP_200_OK
        )