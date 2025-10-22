from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'posts', views.PostViewSet,
                basename='post')  # Erstellt API Endpoints
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'chats', views.ChatViewSet, basename='chat')
router.register(r'messages', views.MessageViewSet, basename='message')

urlpatterns = [
    # API Routes - unter /api/posts/
    path('api/', include(router.urls)),
    path('api/login/', views.api_login, name='api_login'),
    path('api/register/', views.api_register, name='api_register'),
    path('api/jwt/login/', views.jwt_login, name='jwt_login'),
    path('api/jwt/register/', views.jwt_register, name='jwt_register'),

    # Deine bestehenden HTML Routes
    path('', views.index, name='index'),
    path('post/<str:pk>', views.post, name='post'),
    path('register', views.register, name='register'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
]
