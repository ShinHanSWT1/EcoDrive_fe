import {useState} from 'react';
import {Link} from 'react-router-dom';
import HeaderNav from './HeaderNav';
import MoreMenu from './MoreMenu';
import NotificationDropdown from '../../features/notification/components/NotificationDropdown';
import {useNotification} from '../../features/notification/useNotification';
import type {UserMe} from '../types/api';

interface HeaderProps {
    currentUser: UserMe | null;
    isAuthenticated: boolean;
    onLogout: () => void;
}

export default function Header({currentUser, isAuthenticated, onLogout}: HeaderProps) {
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
        <header
            className="h-16 md:h-24 border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm flex items-center">
            <div className="max-w-350 mx-auto w-full px-4 md:px-12 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link to="/" className="flex items-center gap-1.5 md:gap-2">
                        <img src="/media/logo5.png" alt="EcoDrive"
                             className="w-10 h-10 md:w-14 md:h-14 object-contain"/>
                        <span className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter">
 EcoDrive
 </span>
                    </Link>
                    {isAuthenticated && <HeaderNav/>}
                </div>

                <div className="flex items-center gap-2 md:gap-8">
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
                            <MoreMenu currentUser={currentUser} onLogout={onLogout}/>
                        </>
                    ) : (
                        <Link to="/login"
                              className="px-10 py-3.5 bg-blue-600 text-white text-base font-black rounded-full hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                            로그인
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
