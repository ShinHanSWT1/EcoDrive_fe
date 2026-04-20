import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
 Trophy, 
 Settings, 
 LogOut, 
 LayoutDashboard,
 ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
 createAvatarFallbackHandler,
 getAvatarImageSrc,
} from '../lib/avatar';
import type { UserMe } from '../types/api';

interface MoreMenuProps {
 currentUser: UserMe | null;
 onLogout: () => void;
}

const PRIMARY_MENU_ITEMS = [
 { to: '/mission', label: '미션 & 혜택', icon: Trophy },
 { to: '/profile', label: '설정 및 프로필', icon: Settings },
] as const;

const SECONDARY_MENU_ITEMS = [
 {
 to: '/admin',
 label: '관리자 모드',
 icon: LayoutDashboard,
 className:
 'text-slate-400 hover:bg-slate-50 hover:text-slate-900',
 },
] as const;

export default function MoreMenu({ currentUser, onLogout }: MoreMenuProps) {
 const [isOpen, setIsOpen] = useState(false);
 const menuRef = useRef<HTMLDivElement>(null);
 const nickname = currentUser?.nickname ?? '사용자';
 const profileImageUrl = getAvatarImageSrc(currentUser?.profileImageUrl, nickname);
 const handleProfileImageError = createAvatarFallbackHandler(nickname);

 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
 setIsOpen(false);
 }
 };
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 function closeMenu() {
 setIsOpen(false);
 }

 function toggleMenu() {
 setIsOpen((prev) => !prev);
 }

 return (
 <div className="relative" ref={menuRef}>
 <div
 className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition-all hover:border-blue-200 hover:bg-white"
 >
 <Link
 to="/profile"
 className="flex items-center gap-2 p-1 pl-1 pr-2"
 onClick={closeMenu}
 >
 <div className="h-8 w-8 overflow-hidden rounded-xl bg-slate-200">
 <img
 src={profileImageUrl}
 alt="Profile"
 onError={handleProfileImageError}
 className="h-full w-full object-cover"
 />
 </div>
 <span className="hidden text-xs font-bold md:block">
 {nickname}님
 </span>
 </Link>
 <button
 type="button"
 onClick={toggleMenu}
 aria-label="마이페이지 메뉴 열기"
 className="flex h-full items-center rounded-r-2xl px-3 py-3 text-slate-500 transition-all hover:bg-white hover:text-slate-700"
 >
 <ChevronDown
 size={14}
 className={cn("transition-transform", isOpen && "rotate-180")}
 />
 </button>
 </div>

 {isOpen && (
 <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl py-2 z-50 animate-in fade-in zoom-in duration-200">
 {PRIMARY_MENU_ITEMS.map((item) => (
 <Link
 key={item.to}
 to={item.to}
 onClick={closeMenu}
 className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
 >
 <item.icon size={18} />
 {item.label}
 </Link>
 ))}
 <div className="h-px bg-slate-100 my-1 mx-2"></div>
 {SECONDARY_MENU_ITEMS.map((item) => (
 <Link
 key={item.to}
 to={item.to}
 onClick={closeMenu}
 className={cn(
 'flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all',
 item.className,
 )}
 >
 <item.icon size={18} />
 {item.label}
 </Link>
 ))}
 <button
 onClick={() => {
 onLogout();
 closeMenu();
 }}
 className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
 >
 <LogOut size={18} />
 로그아웃
 </button>
 </div>
 )}
 </div>
 );
}
