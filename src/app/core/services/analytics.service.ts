import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OverviewAnalytics, ServiceAnalytics, AnalyticsPeriod } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOverview(period: AnalyticsPeriod = 'month'): Observable<OverviewAnalytics> {
    return this.http.get<OverviewAnalytics>(`${this.base}/analytics/overview`, {
      params: { period },
    });
  }

  getServiceAnalytics(serviceId: string, period: AnalyticsPeriod = 'month'): Observable<ServiceAnalytics> {
    return this.http.get<ServiceAnalytics>(`${this.base}/analytics/services/${serviceId}`, {
      params: { period },
    });
  }
}
