import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {
    private apiUrl = 'http://localhost:8000/api';

    constructor(private http: HttpClient, private authService: AuthService) { }

    uploadFile(file: File, orderId: number): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('order_id', orderId.toString());

        return this.http.post(`${this.apiUrl}/upload/`, formData, {
            headers: this.authService.getAuthHeaders(),
            reportProgress: true,
            observe: 'events'
        }).pipe(
            map(event => this.getEventMessage(event, file)),
            catchError(this.handleError)
        );
    }

    private getEventMessage(event: HttpEvent<any>, file: File) {
        switch (event.type) {
            case HttpEventType.UploadProgress:
                return this.fileUploadProgress(event);
            case HttpEventType.Response:
                return event.body;
            default:
                return `File "${file.name}" surprising upload event: ${event.type}.`;
        }
    }

    private fileUploadProgress(event: any) {
        const percentDone = Math.round(100 * event.loaded / event.total);
        return { status: 'progress', message: percentDone };
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
        }
        return throwError('Something bad happened; please try again later.');
    }
}
