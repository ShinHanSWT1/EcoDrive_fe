import { useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderNav from './HeaderNav';
import MoreMenu from './MoreMenu';
import NotificationDropdown from '../../features/notification/components/NotificationDropdown';
import { useNotification } from '../../features/notification/useNotification';
import type { UserMe } from '../types/api';

interface HeaderProps {
  currentUser: UserMe | null;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function Header({ currentUser, isAuthenticated, onLogout }: HeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotification();

  return (
    <header className="h-16 md:h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/media/logo3.png" alt="EcoDrive" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
        </Link>
        <Link to="/onboarding" className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
          EcoDrive
        </Link>
        {isAuthenticated && <HeaderNav />}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {isAuthenticated ? (
          <>
            <NotificationDropdown
              isOpen={isNotificationOpen}
              onToggle={() => setIsNotificationOpen((prev) => !prev)}
              notifications={notifications}
              unreadCount={unreadCount}
              isLoading={isLoading}
              onOpen={fetchNotifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
            <MoreMenu currentUser={currentUser} onLogout={onLogout} />
          </>
        ) : (
          <Link to="/login" className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
