import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000';  // Nur die Basis-URL

  constructor(private http: HttpClient) { }

  getPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/posts/`);  // Komplette URL
  }

  getPost(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/posts/${id}/`);
  }

  createPost(post: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/posts/`, post);
  }

  updatePost(id: number, post: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/posts/${id}/`, post);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/posts/${id}/`);
  }
}