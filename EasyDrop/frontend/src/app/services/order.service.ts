import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = 'http://localhost:8000/api';

    constructor(private http: HttpClient, private authService: AuthService) { }

    getOrders(): Observable<any> {
        return this.http.get(`${this.apiUrl}/orders/`, { headers: this.authService.getAuthHeaders() });
    }

    getOrder(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/orders/${id}/`, { headers: this.authService.getAuthHeaders() });
    }

    createOrder(order: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/orders/`, order, { headers: this.authService.getAuthHeaders() });
    }

    updateOrder(id: number, order: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/orders/${id}/`, order, { headers: this.authService.getAuthHeaders() });
    }

    deleteOrder(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/orders/${id}/`, { headers: this.authService.getAuthHeaders() });
    }
}
