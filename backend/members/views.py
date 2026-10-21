from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
import secrets
import threading
from core.utils import send_otp_email
from rest_framework.permissions import AllowAny


User = get_user_model()

class LoginView(APIView):
    # This view does not require authentication thats why the list is empty
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            # get_or_create ensures a token exists even if signal was skipped
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'message': 'Login Successfull'} ,status=status.HTTP_200_OK)
        return Response(
            {'error': 'Invalid credentials'},   
            status=status.HTTP_400_BAD_REQUEST
        )


#Used to check if who is who and block unauthorized users
class ProtectedProfileView(APIView):

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
    permission_classes = [AllowAny]

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
        
        #Generating OTP verificaton code
        otp_code= "".join([str(secrets.randbelow(10)) for _ in range(6)])

        if email:
            email_thread= threading.Thread(
                target= send_otp_email,
                args=(email, otp_code, username)
            )
            email_thread.start()
        # Return success response with the token
        return Response({
            'token': token.key,
            'username': user.username,
            'message': "Registration successful. Please check your mail for the OTP to verify your account.",
        }, status=status.HTTP_201_CREATED)


class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        try:
            # request.auth holds the Token instance when TokenAuthentication is used
            if request.auth:
                request.auth.delete()
                return Response(
                    {"message": "Successfully logged out."},
                    status=status.HTTP_200_OK
                )
            return Response(
                {"error": "No active token found."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )