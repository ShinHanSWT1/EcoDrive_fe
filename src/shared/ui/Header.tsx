import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
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
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <ShieldCheck size={20} className="text-white md:size-24" />
          </div>
          <span className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Driving Insight</span>
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
