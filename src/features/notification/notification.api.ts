import { api } from '../../shared/api/client';
import type { ApiResponse } from '../../shared/types/api';
import type { Notification } from './notification.types';

export async function getNotifications(): Promise<Notification[]> {
  const response = await api.get<ApiResponse<Notification[]>>('/notifications');
  return response.data.data;
}

export async function getUnreadCount(): Promise<number> {
  const response = await api.get<ApiResponse<number>>('/notifications/unread-count');
  return response.data.data;
}

export async function markAsRead(id: number): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

export async function markAllAsRead(): Promise<void> {
  await api.patch('/notifications/read-all');
}
