import { Car, Info, TrendingDown, ChevronRight, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import type { TodayDrivingSummaryItem } from "../dashboard.types";

type DashboardSidePanelProps = {
 pointBalance: number;
 todayEarnedPoints: number;
 summaryNote: string;
 todayDrivingSummary: TodayDrivingSummaryItem[];
};

export default function DashboardSidePanel({
 pointBalance,
 todayEarnedPoints,
 summaryNote,
 todayDrivingSummary,
}: DashboardSidePanelProps) {
 const navigate = useNavigate();

 return (
 <div className="space-y-6">
 {/* Playful Wallet Widget */}
 <motion.div 
 initial={{ opacity: 0, x: 40 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
 whileHover={{ scale: 1.02 }}
 onClick={() => navigate("/payment")}
  className="bg-white border-[0.5px] border-[#A0C878] p-8 rounded-[40px] relative overflow-hidden cursor-pointer group block"
 >
 <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
 <div className="absolute left-10 top-5 w-10 h-10 bg-white/40 rounded-full blur-lg"></div>

 <div className="flex justify-between items-start mb-6 relative z-10">
 <div className="p-4 rounded-[20px] bg-[#143D60] text-white group-hover:-rotate-12 transition-transform">
 <Gift size={28} />
 </div>
 <button
 type="button"
 className="text-xs text-[#143D60] font-black flex items-center gap-1 bg-[#A0C878]/10 border border-[#A0C878]/30 px-3 py-1.5 rounded-full"
 >
 혜택 보기 <ChevronRight size={14} />
 </button>
 </div>

 <div className="text-sm font-extrabold text-[#143D60]/60 relative z-10">보유 포인트</div>
 <div className="flex items-baseline gap-1 mt-1 relative z-10">
 <span className="text-4xl font-black text-[#143D60] tracking-tight">
 {pointBalance.toLocaleString("ko-KR")}
 </span>
 <span className="text-lg font-black text-[#143D60]">P</span>
 </div>

 <div className="mt-4 text-xs font-bold text-[#143D60] bg-white border-2 border-[#143D60] px-4 py-2 rounded-2xl w-fit relative z-10 ">
 오늘 🎉 {todayEarnedPoints.toLocaleString("ko-KR")}P 적립!
 </div>
 </motion.div>

 {/* Playful Driving Summary Widget */}
 <motion.div 
 initial={{ opacity: 0, x: 40 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.3 }}
 className="bg-white p-8 rounded-[40px] relative"
 >
 <h3 className="font-black text-xl mb-6 text-slate-900">오늘의 주행 요약</h3>

 <div className="space-y-5">
 {todayDrivingSummary.map((item, index) => (
 <motion.div 
 key={item.id} 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.4 + index * 0.1 }}
 className="flex items-center gap-4 group hover:bg-slate-50 p-3 -mx-3 rounded-3xl transition-colors cursor-default"
 >
 <div className="w-14 h-14 bg-slate-100 rounded-[20px] flex items-center justify-center text-slate-600 group-hover:scale-110 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
 {item.icon === "car" ? (
 <Car size={24} />
 ) : (
 <TrendingDown size={24} />
 )}
 </div>

 <div className="flex-1">
 <div className="text-base font-black text-slate-900">{item.title}</div>
 <div className="text-sm font-bold text-slate-400">{item.description}</div>
 </div>

 <div
 className={`text-sm font-black px-3 py-1.5 rounded-full ${
 item.statusTone === "danger"
 ? "text-red-600 bg-red-50"
 : "text-blue-600 bg-blue-50"
 }`}
 >
 {item.statusText}
 </div>
 </motion.div>
 ))}

 <motion.div 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
 className="mt-6 p-4 bg-blue-50 rounded-[24px] text-xs text-blue-700 font-bold leading-relaxed border border-blue-100 flex items-start gap-2"
 >
 <Info size={16} className="flex-shrink-0 mt-0.5" />
 <div>{summaryNote}</div>
 </motion.div>
 </div>
 </motion.div>
 </div>
 );
}
