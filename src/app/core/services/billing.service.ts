import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MyUsage, Plan, PlanName, Subscription } from '../models/billing.model';

@Injectable({ providedIn: 'root' })
export class BillingService {
  private base = environment.apiUrl;

  /** Shared plan/usage state — populated once by the dashboard shell. */
  currentUsage$ = new BehaviorSubject<MyUsage | null>(null);

  constructor(private http: HttpClient) {}

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.base}/billing/plans`);
  }

  getMyPlan(): Observable<{ plan: Plan; subscription: Subscription }> {
    return this.http.get<{ plan: Plan; subscription: Subscription }>(
      `${this.base}/billing/my-plan`,
    );
  }

  getMyUsage(): Observable<MyUsage> {
    return this.http.get<MyUsage>(`${this.base}/billing/my-usage`);
  }

  changePlan(planName: PlanName): Observable<any> {
    return this.http.patch<any>(`${this.base}/billing/change-plan`, { planName });
  }

  /** Lemon Squeezy hosted checkout — returns a URL to redirect to. */
  createCheckout(planName: PlanName): Observable<{ checkoutUrl: string }> {
    return this.http.post<{ checkoutUrl: string }>(`${this.base}/billing/checkout`, {
      planName,
    });
  }

  cancelSubscription(): Observable<any> {
    return this.http.post<any>(`${this.base}/billing/cancel`, {});
  }

  /** Fetches usage and pushes it into the shared BehaviorSubject. */
  loadUsage(): Observable<MyUsage> {
    return this.getMyUsage().pipe(tap((usage) => this.currentUsage$.next(usage)));
  }
}
