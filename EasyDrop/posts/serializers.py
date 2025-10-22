from rest_framework import serializers
from .models import Post, Order, Chat, Message


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'  # Nimmt alle Felder aus dem Post Model


class OrderSerializer(serializers.ModelSerializer):
    customer_username = serializers.CharField(
        source='customer.username', read_only=True)
    assigned_to_username = serializers.CharField(
        source='assigned_to.username', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'customer_username', 'title', 'description',
                  'status', 'created_at', 'updated_at', 'assigned_to', 'assigned_to_username']
        read_only_fields = ['customer', 'created_at', 'updated_at']


class ChatSerializer(serializers.ModelSerializer):
    order_title = serializers.CharField(source='order.title', read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'order', 'order_title', 'created_at']
        read_only_fields = ['created_at']


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(
        source='sender.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender', 'sender_username',
                  'content', 'timestamp', 'is_file', 'file_url']
        read_only_fields = ['sender', 'timestamp']
