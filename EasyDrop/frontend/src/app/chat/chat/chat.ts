import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  orderId: number;
  messages: any[] = [];
  newMessage = '';
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService
  ) {
    this.orderId = +this.route.snapshot.paramMap.get('orderId')!;
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.chatService.connectToChat(this.orderId.toString());
    this.chatService.getMessages().subscribe((message: any) => {
      this.messages.push(message);
    });
    // Load existing messages
    this.loadMessages();
  }

  ngOnDestroy() {
    this.chatService.disconnectFromChat();
  }

  loadMessages() {
    this.chatService.getChat(this.orderId).subscribe({
      next: (chats) => {
        if (chats.length > 0) {
          const chatId = chats[0].id;
          this.chatService.getMessagesForChat(chatId).subscribe({
            next: (messages) => {
              this.messages = messages;
            },
            error: (error) => {
              console.error('Error loading messages:', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error loading chat:', error);
      }
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.orderId.toString(), this.newMessage);
      this.newMessage = '';
    }
  }

  isMyMessage(message: any): boolean {
    return message.sender === this.currentUser?.id;
  }
}
