import { ShieldCheck, Zap } from "lucide-react";
import { motion } from "motion/react";

interface SafetyScoreCardProps {
 score: number | null;
 snapshotDate: string | null;
 recentDistanceKm: number;
 monthlyDistanceKm: number | null;
}

export function SafetyScoreCard({
 score,
 snapshotDate,
 recentDistanceKm,
 monthlyDistanceKm,
}: SafetyScoreCardProps) {
 return (
 <motion.div
 whileHover={{ y: -5 }}
 className="p-8 rounded-[40px] text-slate-900 relative overflow-hidden h-full shadow-sm"
 style={{ background: "linear-gradient(135deg, #DDEB9D, #A0C878)" }}
 >
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl pointer-events-none"></div>

 <div className="relative z-10 flex flex-col h-full justify-between">
 <div className="flex justify-between items-start">
 <div>
 <div className="text-[13px] text-slate-900 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 bg-[#A0C878]/10 w-fit px-3 py-1 rounded-full ">
 <Zap size={14} className="text-[#A0C878]" fill="#A0C878" /> 나의 슈퍼 안전 점수
 </div>
 <div className="flex items-baseline gap-1 mt-2">
 <span className="text-7xl font-black text-slate-900">{score ?? 100}</span>
 <span className="text-xl font-bold text-slate-900">점</span>
 </div>
 </div>
 <div className="px-5 py-2 bg-white/60 rounded-full text-slate-900 text-[15px] font-black shadow-sm">
 {snapshotDate ?? "2026-04-20"}
 </div>
 </div>
 <div className="grid grid-cols-2 gap-4 mt-10">
 <div className="bg-white/60 p-5 rounded-2xl shadow-sm">
 <div className="text-[14px] text-slate-900 font-black uppercase mb-1">최근 반영 주행거리</div>
 <div className="text-xl font-black text-slate-900">{recentDistanceKm.toFixed(2)} km</div>
 </div>
 <div className="bg-white/60 p-5 rounded-2xl shadow-sm">
 <div className="text-[14px] text-slate-900 font-black uppercase mb-1">이번 달 누적 주행</div>
 <div className="text-xl font-black text-slate-900">
 {monthlyDistanceKm != null ? `${monthlyDistanceKm.toFixed(2)} km` : "0.00 km"}
 </div>
 </div>
 </div>
 </div>
 <ShieldCheck size={180} className="absolute -bottom-10 -right-10 text-slate-900/5 -rotate-12 pointer-events-none" />
 </motion.div>
 );
}
