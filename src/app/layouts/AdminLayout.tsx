import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart, 
  Settings, 
  LogOut, 
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { getDefaultAvatarDataUrl } from '../../shared/lib/avatar';
import { cn } from '../../shared/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

const adminNavItems = [
  { path: '/admin', icon: LayoutDashboard, label: '관리자 대시보드' },
  { path: '/admin/users', icon: Users, label: '사용자 관리' },
  { path: '/admin/stats', icon: BarChart, label: '통계 분석' },
  { path: '/admin/settings', icon: Settings, label: '시스템 설정' },
];

export default function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen sticky top-0">
        <div className="p-6">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            Admin Console
          </Link>
        </div>
        
        <div className="flex-1 px-4 py-4 space-y-2">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link 
            to="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">사용자 모드</span>
          </Link>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {adminNavItems.find(item => item.path === location.pathname)?.label || '관리자'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900">관리자 홍길동</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">System Admin</div>
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-xl overflow-hidden border border-slate-300">
              <img
                src={getDefaultAvatarDataUrl('A')}
                alt="Admin Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
