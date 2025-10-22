from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'posts', views.PostViewSet)  # Erstellt API Endpoints

urlpatterns = [
    # API Routes - unter /api/posts/
    path('api/', include(router.urls)),
    path('api/login/', views.api_login, name='api_login'),
    path('api/register/', views.api_register, name='api_register'),

    # Deine bestehenden HTML Routes
    path('', views.index, name='index'),
    path('post/<str:pk>', views.post, name='post'),
    path('register', views.register, name='register'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
]
