export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  userId: string;
  createdAt: string;
}

export interface UnreadCount {
  count: number;
}

export type NotificationFilter = 'all' | 'unread' | 'read';
