import { Link, useLocation } from 'react-router-dom';
import { 
 Home, 
 BarChart3, 
 ShieldCheck, 
 ShoppingBag, 
 User 
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
 { path: '/', icon: Home, label: '홈' },
 { path: '/report', icon: BarChart3, label: '리포트' },
 { path: '/insurance', icon: ShieldCheck, label: '보험' },
 { path: '/shop', icon: ShoppingBag, label: 'Pay' },
 { path: '/profile', icon: User, label: '마이' },
];

export default function MobileTabBar() {
 const location = useLocation();

 return (
 <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 px-6 py-3 flex justify-around items-center md:hidden z-50 pb-safe">
 {navItems.map((item) => {
 const Icon = item.icon;
 const isActive = location.pathname === item.path;
 return (
 <Link 
 key={item.path} 
 to={item.path}
 className={cn(
 "flex flex-col items-center gap-1 transition-all",
 isActive ? "text-blue-600 scale-110" : "text-slate-400"
 )}
 >
 <Icon size={24} />
 <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
 </Link>
 );
 })}
 </nav>
 );
}
