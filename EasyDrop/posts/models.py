from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

# Create your models (Methoden) here.


class Post(models.Model):
    title = models.CharField(max_length=100)
    body = models.CharField(max_length=10000000)
    created_at = models.DateTimeField(default=datetime.now, blank=True)


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    customer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='orders')
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=datetime.now)
    updated_at = models.DateTimeField(auto_now=True)
    assigned_to = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_orders')

    def __str__(self):
        return f"Order {self.id}: {self.title}"


class Chat(models.Model):
    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, related_name='chat')
    created_at = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return f"Chat for Order {self.order.id}"


class Message(models.Model):
    chat = models.ForeignKey(
        Chat, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(default=datetime.now)
    is_file = models.BooleanField(default=False)
    file_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"Message from {self.sender.username} in Chat {self.chat.id}"
