import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css'
})
export class OrderDetailComponent implements OnInit {
  order: any = null;
  loading = false;
  orderId: number;
  selectedFile: File | null = null;
  uploadProgress = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private fileUploadService: FileUploadService
  ) {
    this.orderId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.loadOrder();
  }

  loadOrder() {
    this.loading = true;
    this.orderService.getOrder(this.orderId).subscribe({
      next: (data) => {
        this.order = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      this.fileUploadService.uploadFile(this.selectedFile, this.orderId).subscribe({
        next: (event) => {
          if (event.status === 'progress') {
            this.uploadProgress = event.message;
          } else {
            console.log('File uploaded successfully', event);
            this.selectedFile = null;
            this.uploadProgress = 0;
            // Refresh order to show new file
            this.loadOrder();
          }
        },
        error: (error) => {
          console.error('Error uploading file:', error);
          this.uploadProgress = 0;
        }
      });
    }
  }

  updateStatus(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value;
    this.orderService.updateOrder(this.orderId, { status: newStatus }).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;
      },
      error: (error) => {
        console.error('Error updating status:', error);
      }
    });
  }

  goToChat() {
    this.router.navigate(['/chat', this.orderId]);
  }
}
