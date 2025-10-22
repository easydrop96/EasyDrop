import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private apiUrl = 'http://localhost:8000/api';

    constructor(private socket: Socket, private authService: AuthService, private http: HttpClient) { }

    connectToChat(orderId: string): void {
        this.socket.connect();
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.socket.emit('join', { order_id: orderId, user_id: user.id });
            }
        });
    }

    disconnectFromChat(): void {
        this.socket.disconnect();
    }

    sendMessage(orderId: string, message: string): void {
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.socket.emit('send_message', {
                    order_id: orderId,
                    message: message,
                    user_id: user.id
                });
            }
        });
    }

    getMessages(): Observable<any> {
        return this.socket.fromEvent('message');
    }

    getChats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/chats/`, { headers: this.authService.getAuthHeaders() });
    }

    getChat(orderId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/chats/?order=${orderId}`, { headers: this.authService.getAuthHeaders() });
    }

    getMessagesForChat(chatId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/messages/?chat=${chatId}`, { headers: this.authService.getAuthHeaders() });
    }
}
