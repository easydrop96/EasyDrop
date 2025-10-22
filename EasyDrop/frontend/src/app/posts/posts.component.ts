import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: any[] = [];
  isLoading: boolean = true;
  error: string = '';

  constructor(private apiService: ApiService) { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.loadPosts();
    } else {
      this.isLoading = false;
      this.posts = [];
    }
  }

  loadPosts(): void {
    this.isLoading = true;
    this.error = '';

    console.log('Starte API Call...');

    this.apiService.getPosts().subscribe({
      next: (data) => {
        console.log('API Response:', data);
        console.log('Data Type:', typeof data);
        console.log('Data Length:', data.length);

        this.posts = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        console.error('Error Details:', err.status, err.statusText);

        this.error = err.message;
        this.isLoading = false;

        // Test-Daten
        this.posts = [
          { id: 1, title: 'Test Post 1', content: 'Dies ist ein Test-Post' },
          { id: 2, title: 'Test Post 2', content: 'Noch ein Test-Post' }
        ];
      }
    });
  }

}