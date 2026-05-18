import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Feedback, FeedbackStats } from '../models/feedback.model';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly base = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  submit(slug: string, data: { rating: number; comment?: string }): Observable<Feedback> {
    return this.http.post<Feedback>(`${this.base}/public/services/${slug}/feedback`, data);
  }

  getAll(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.base}/feedback`);
  }

  getByService(serviceId: string): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.base}/feedback/service/${serviceId}`);
  }

  getStats(serviceId: string): Observable<FeedbackStats> {
    return this.http.get<FeedbackStats>(`${this.base}/feedback/service/${serviceId}/stats`);
  }
}
