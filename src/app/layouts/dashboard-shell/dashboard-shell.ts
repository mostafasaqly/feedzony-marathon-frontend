import { Component, OnInit } from '@angular/core';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService, User } from '../../core/services/auth';
import { NotificationsService } from '../../core/services/notifications.service';
import { NotificationBell } from '../components/notification-bell/notification-bell';

@Component({
  selector: 'app-dashboard-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TitleCasePipe, AsyncPipe, NotificationBell],
  templateUrl: './dashboard-shell.html',
  styleUrl: './dashboard-shell.scss',
})
export class DashboardShell implements OnInit {
  currentUser: User | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    public notificationsSvc: NotificationsService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
