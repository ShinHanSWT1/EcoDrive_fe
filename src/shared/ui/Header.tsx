import { Link } from 'react-router-dom';
import { Bell, ShieldCheck, User } from 'lucide-react';
import HeaderNav from './HeaderNav';
import MoreMenu from './MoreMenu';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function Header({ isAuthenticated, onLogout }: HeaderProps) {
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
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <Link to="/profile" className="hidden md:flex items-center gap-3 p-1 pr-3 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-200 transition-all">
              <div className="w-8 h-8 bg-slate-200 rounded-xl overflow-hidden">
                <img src="https://picsum.photos/seed/user/100/100" alt="Profile" />
              </div>
              <span className="text-xs font-bold text-slate-700">홍길동님</span>
            </Link>
            <MoreMenu onLogout={onLogout} />
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
