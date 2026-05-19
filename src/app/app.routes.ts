import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { DashboardShell } from './layouts/dashboard-shell/dashboard-shell';
import { Dashboard } from './pages/dashboard/dashboard';
import { ServiceList } from './pages/services/service-list/service-list';
import { CreateService } from './pages/services/create-service/create-service';
import { EditService } from './pages/services/edit-service/edit-service';
import { FeedbackList } from './pages/feedback/feedback-list/feedback-list';
import { PublicFeedback } from './pages/public-feedback/public-feedback';
import { AnalyticsOverview } from './pages/analytics/analytics-overview/analytics-overview';
import { ServiceAnalytics } from './pages/analytics/service-analytics/service-analytics';
import { PlansPage } from './pages/billing/plans-page/plans-page';
import { BillingDashboard } from './pages/billing/billing-dashboard/billing-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'plans', component: PlansPage },
  {
    path: 'dashboard',
    component: DashboardShell,
    canActivate: [authGuard],
    children: [
      { path: '', component: Dashboard },
      { path: 'services', component: ServiceList },
      { path: 'services/create', component: CreateService },
      { path: 'services/:id/edit', component: EditService },
      { path: 'feedback', component: FeedbackList },
      { path: 'feedback/:serviceId', component: FeedbackList },
      { path: 'analytics', component: AnalyticsOverview },
      { path: 'analytics/:serviceId', component: ServiceAnalytics },
      { path: 'billing', component: BillingDashboard },
      { path: 'billing/plans', component: PlansPage },
    ],
  },
  { path: 'f/:slug', component: PublicFeedback },
];
