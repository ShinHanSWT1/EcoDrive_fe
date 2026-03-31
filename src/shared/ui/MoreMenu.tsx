import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MoreHorizontal, 
  Trophy, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';

interface MoreMenuProps {
  onLogout: () => void;
}

export default function MoreMenu({ onLogout }: MoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
      >
        <MoreHorizontal size={20} />
        <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-200">
          <Link
            to="/mission"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
          >
            <Trophy size={18} />
            미션 & 혜택
          </Link>
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
          >
            <Settings size={18} />
            설정 및 프로필
          </Link>
          <div className="h-px bg-slate-100 my-1 mx-2"></div>
          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <LayoutDashboard size={18} />
            관리자 모드
          </Link>
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
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
