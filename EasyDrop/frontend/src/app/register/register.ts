import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  vorname: string = '';
  nachname: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  password2: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  checkPasswordRequirements() {
    const password = this.password;
    document.getElementById('length')?.classList.toggle('met', password.length >= 8);
    document.getElementById('uppercase')?.classList.toggle('met', /[A-Z]/.test(password));
    document.getElementById('number')?.classList.toggle('met', /[0-9]/.test(password));
    document.getElementById('special')?.classList.toggle('met', /[!@#$%^&*(),.?":{}|<>]/.test(password));
  }

  checkPasswordMatch() {
    const password = this.password;
    const password2 = this.password2;
    const matchElement = document.getElementById('passwordMatch');
    if (matchElement) {
      if (password2 === '') {
        matchElement.textContent = '';
        matchElement.style.color = '';
      } else if (password === password2) {
        matchElement.textContent = '✓ Passwörter stimmen überein';
        matchElement.style.color = '#28a745';
      } else {
        matchElement.textContent = '✗ Passwörter stimmen nicht überein';
        matchElement.style.color = '#dc3545';
      }
    }
  }

  onSubmit() {
    if (this.password !== this.password2) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    if (!this.isPasswordValid(this.password)) {
      this.errorMessage = 'Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character';
      return;
    }

    this.authService.register(this.vorname, this.nachname, this.username, this.email, this.password, this.password2).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful! Please login.';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        this.errorMessage = error.error.error || 'Registration failed';
        this.successMessage = '';
      }
    });
  }

  isPasswordValid(password: string): boolean {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasUppercase && hasNumber && hasSpecial;
  }
}
