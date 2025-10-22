import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8000/api';
    private tokenKey = 'auth_token';
    private refreshTokenKey = 'refresh_token';
    private userKey = 'user';

    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        const token = localStorage.getItem(this.tokenKey);
        const user = localStorage.getItem(this.userKey);
        if (token && user) {
            this.currentUserSubject.next(JSON.parse(user));
        }
    }

    login(username: string, password: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = { username, password };
        return this.http.post(`${this.apiUrl}/jwt/login/`, body, { headers }).pipe(
            tap((response: any) => {
                if (response.access && response.refresh) {
                    localStorage.setItem(this.tokenKey, response.access);
                    localStorage.setItem(this.refreshTokenKey, response.refresh);
                    localStorage.setItem(this.userKey, JSON.stringify(response.user));
                    this.currentUserSubject.next(response.user);
                }
            })
        );
    }

    register(first_name: string, last_name: string, username: string, email: string, password: string, password2: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = { first_name, last_name, username, email, password, password2 };
        return this.http.post(`${this.apiUrl}/jwt/register/`, body, { headers }).pipe(
            tap((response: any) => {
                if (response.access && response.refresh) {
                    localStorage.setItem(this.tokenKey, response.access);
                    localStorage.setItem(this.refreshTokenKey, response.refresh);
                    localStorage.setItem(this.userKey, JSON.stringify(response.user));
                    this.currentUserSubject.next(response.user);
                }
            })
        );
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUserSubject.next(null);
    }

    getAuthHeaders(): HttpHeaders {
        const token = this.getToken();
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        });
    }
}
