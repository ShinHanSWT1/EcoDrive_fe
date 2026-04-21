import { useEffect, useRef } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import type { Notification } from '../notification.types';

interface Props {
 isOpen: boolean;
 onToggle: () => void;
 notifications: Notification[];
 unreadCount: number;
 isLoading: boolean;
 onOpen: () => void;
 onMarkAsRead: (id: number) => void;
 onMarkAllAsRead: () => void;
}

export default function NotificationDropdown({
 isOpen,
 onToggle,
 notifications,
 unreadCount,
 isLoading,
 onOpen,
 onMarkAsRead,
 onMarkAllAsRead,
}: Props) {
 const ref = useRef<HTMLDivElement>(null);

 useEffect(() => {
 if (isOpen) onOpen();
 }, [isOpen, onOpen]);

 useEffect(() => {
 function handleClickOutside(e: MouseEvent) {
 if (ref.current && !ref.current.contains(e.target as Node)) {
 if (isOpen) onToggle();
 }
 }
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, [isOpen, onToggle]);

 return (
 <div className="relative" ref={ref}>
 <button
 onClick={onToggle}
 className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all relative"
 >
 <Bell size={20} />
 {unreadCount > 0 && (
 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
 )}
 </button>

 {isOpen && (
 <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-100 z-50 overflow-hidden">
 <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
 <span className="font-bold text-slate-800 text-sm">알림</span>
 {unreadCount > 0 && (
 <button
 onClick={onMarkAllAsRead}
 className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 font-medium"
 >
 <CheckCheck size={14} />
 모두 읽음
 </button>
 )}
 </div>

 <div className="max-h-96 overflow-y-auto">
 {isLoading ? (
 <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
 불러오는 중...
 </div>
 ) : notifications.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-12 gap-2">
 <Bell size={32} className="text-slate-200" />
 <p className="text-slate-400 text-sm">알림 내역이 없습니다.</p>
 </div>
 ) : (
 notifications.map((n) => (
 <div
 key={n.id}
 onClick={() => !n.isRead && onMarkAsRead(n.id)}
 className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-all ${
 !n.isRead ? 'bg-slate-50' : ''
 }`}
 >
 <div className="flex items-start justify-between gap-2">
 <div className="flex-1">
 <p className="text-sm font-semibold text-slate-800">{n.title}</p>
 <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>
 <p className="text-xs text-slate-400 mt-1">
 {new Date(n.createdAt).toLocaleDateString('ko-KR')}
 </p>
 </div>
 {!n.isRead && (
 <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: '#1A5D40' }} />
 )}
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 )}
 </div>
 );
}
