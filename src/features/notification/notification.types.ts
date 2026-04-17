export type NotificationType = 'INSURANCE_EXPIRY' | 'MISSION_COMPLETED';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}
