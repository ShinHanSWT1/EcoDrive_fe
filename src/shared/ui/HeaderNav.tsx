import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

const navItems = [
 { path: "/", label: "홈" },
 { path: "/report", label: "리포트" },
 { path: "/insurance", label: "보험" },
 { path: "/payment", label: "Pay" },
];

export default function HeaderNav() {
 const location = useLocation();

 return (
 <nav className="hidden md:flex items-center gap-10">
 {navItems.map((item) => {
 const isActive = location.pathname === item.path;
 return (
 <Link
 key={item.path}
 to={item.path}
 className={cn(
 "text-base font-black transition-all hover:text-blue-600 relative py-2",
 isActive 
 ? "text-blue-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-600" 
 : "text-slate-600",
 )}
 >
 {item.label}
 </Link>
 );
 })}
 </nav>
 );
}
