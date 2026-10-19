from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

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
