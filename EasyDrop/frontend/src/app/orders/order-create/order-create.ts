import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-create.html',
  styleUrl: './order-create.css'
})
export class OrderCreateComponent {
  orderForm: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      customer_name: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.orderForm.valid) {
      this.submitting = true;
      this.orderService.createOrder(this.orderForm.value).subscribe({
        next: (order) => {
          this.router.navigate(['/orders', order.id]);
        },
        error: (error) => {
          console.error('Error creating order:', error);
          this.submitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.orderForm.controls).forEach(key => {
      const control = this.orderForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(field: string): string {
    const control = this.orderForm.get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
