import { useCallback, useEffect, useState } from 'react';
import { getNotifications, getUnreadCount, markAllAsRead, markAsRead } from './notification.api';
import type { Notification } from './notification.types';

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (e) {
      console.error('읽지 않은 알림 수 조회 실패:', e);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (e) {
      console.error('알림 목록 조회 실패:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMarkAsRead = useCallback(async (id: number) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
  };
}
