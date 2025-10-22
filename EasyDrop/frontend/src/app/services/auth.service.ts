import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8000/api';

    constructor(private http: HttpClient) { }

    login(username: string, password: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = { username, password };
        return this.http.post(`${this.apiUrl}/login/`, body, { headers });
    }

    register(vorname: string, nachname: string, username: string, email: string, password: string, password2: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = { vorname, nachname, username, email, password, password2 };
        return this.http.post(`${this.apiUrl}/register/`, body, { headers });
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('user');
    }

    logout(): void {
        localStorage.removeItem('user');
    }
}
