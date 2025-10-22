from django.shortcuts import render, redirect
from .models import Post
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User, auth
from django.contrib import messages
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.views.decorators.csrf import csrf_exempt
import json

from .serializers import PostSerializer

# Create your views here.


def index(request):
    posts = Post.objects.all()
    return render(request, 'index.html', {'posts': posts})


def post(request, pk):
    posts = Post.objects.get(id=pk)

    return render(request, 'posts.html', {'posts': posts})


def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            return redirect('/')
        else:
            messages.info(request, ' ist Invalid')
            return redirect('login')
    else:
        return render(request, 'login.html')


def logout(request):
    auth.logout(request)
    return redirect('/')


def register(request):

    if request.method == 'POST':
        vorname = request.POST.get('vorname', '')
        nachname = request.POST.get('nachname', '')
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['password2']

        if password == password2:

            if User.objects.filter(email=email).exists():
                print('email existiert schon')
                messages.info(request, 'Email alerady exist')
                return redirect('register')
            elif User.objects.filter(username=username).exists():
                print('username existiert schon')
                messages.info(request, 'Username alerady exist')
                return redirect('register')
            else:
                print('passwort stimmt')
                user = User.objects.create_user(
                    username=username, email=email, password=password, first_name=vorname, last_name=nachname)
                user.save()
                messages.info(request, 'regester ok')
                return redirect('login')
        else:
            messages.info(request, 'Password ist not seam')
            return redirect('register')

    else:
        return render(request, 'register.html')


@api_view(['POST'])
@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                auth_login(request, user)
                return Response({'message': 'Login successful', 'user': {'username': user.username, 'email': user.email}}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST'])
@csrf_exempt
def api_register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            vorname = data.get('vorname', '')
            nachname = data.get('nachname', '')
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            password2 = data.get('password2')

            if not all([username, email, password, password2]):
                return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

            if password != password2:
                return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

            # Password validation
            if len(password) < 8:
                return Response({'error': 'Password must be at least 8 characters long'}, status=status.HTTP_400_BAD_REQUEST)
            if not any(char.isupper() for char in password):
                return Response({'error': 'Password must contain at least one uppercase letter'}, status=status.HTTP_400_BAD_REQUEST)
            if not any(char.isdigit() for char in password):
                return Response({'error': 'Password must contain at least one number'}, status=status.HTTP_400_BAD_REQUEST)
            if not any(char in '!@#$%^&*(),.?":{}|<>' for char in password):
                return Response({'error': 'Password must contain at least one special character'}, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(email=email).exists():
                return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(
                username=username, email=email, password=password, first_name=vorname, last_name=nachname)
            user.save()
            return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
