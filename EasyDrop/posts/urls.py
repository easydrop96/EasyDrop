from django.urls import path
from . import views

urlpatterns = [
    #    seite, code, methodeName
    path('', views.index, name='index'),
    # seite mit pk ist info von backend
    path('post/<str:pk>', views.post, name='post'),
    path('register', views.register, name='register'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),

]
