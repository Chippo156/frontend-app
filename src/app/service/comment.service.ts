import { Injectable } from '@angular/core';
import { environtment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommmentService {
  private apiBaseComment = `${environtment}/comments`;

  constructor(private http: HttpClient) {}

  createComment(comment: any): Observable<any> {
    return this.http.post(`${this.apiBaseComment}`, comment);
  }
  
}
