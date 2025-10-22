import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Order, Chat, Message
from django.contrib.auth.models import User


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.order_id = self.scope['url_route']['kwargs']['order_id']
        self.room_group_name = f'chat_{self.order_id}'

        # Check if user has access to this order
        if await self.can_access_order():
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        user_id = text_data_json['user_id']

        # Save message to database
        message_obj = await self.save_message(message, user_id)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user_id': user_id,
                'username': message_obj.sender.username,
                'timestamp': str(message_obj.timestamp),
            }
        )

    async def chat_message(self, event):
        message = event['message']
        user_id = event['user_id']
        username = event['username']
        timestamp = event['timestamp']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'user_id': user_id,
            'username': username,
            'timestamp': timestamp,
        }))

    @database_sync_to_async
    def can_access_order(self):
        try:
            order = Order.objects.get(id=self.order_id)
            user = self.scope['user']
            return order.customer == user or order.assigned_to == user
        except Order.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, message, user_id):
        user = User.objects.get(id=user_id)
        chat = Chat.objects.get(order_id=self.order_id)
        return Message.objects.create(chat=chat, sender=user, content=message)
