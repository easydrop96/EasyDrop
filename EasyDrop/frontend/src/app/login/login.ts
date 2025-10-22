import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        // Store user data or token if needed
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/']); // Navigate to start page
      },
      error: (error) => {
        this.errorMessage = error.error.error || 'Login failed';
      }
    });
  }
}
