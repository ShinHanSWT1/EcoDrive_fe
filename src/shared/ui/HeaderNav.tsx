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
 <nav aria-label="주요 탐색 메뉴" className="hidden md:flex items-center gap-10">
 {navItems.map((item) => {
 const isActive = location.pathname === item.path;
 return (
 <Link
 key={item.path}
 to={item.path}
 aria-current={isActive ? "page" : undefined}
 className={cn(
 "text-base font-black transition-all hover:text-[#1a5d40] relative py-2",
 isActive
 ? "text-[#1a5d40] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#1a5d40]"
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
