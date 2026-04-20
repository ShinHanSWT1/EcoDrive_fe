import { Leaf } from "lucide-react";
import { motion } from "motion/react";

interface CarbonReductionCardProps {
 carbonReductionKg: number | null;
 rewardPoint: number | null;
 monthLabel: string | null;
}

export function CarbonReductionCard({
 carbonReductionKg,
 rewardPoint,
 monthLabel,
}: CarbonReductionCardProps) {
 return (
 <motion.div 
 whileHover={{ y: -8, rotate: 1 }}
 className="bg-white p-8 rounded-[40px] text-slate-900 relative overflow-hidden h-full border-[0.5px] border-[#143D60]"
 >
 <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
 
 <div className="relative z-10">
 <div className="flex justify-between items-start mb-6">
 <div className="space-y-3">
 <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
 <Leaf size={14} fill="#A0C878" className="text-[#A0C878]" />
 탄소 다이어트 쓱싹 성공!
 </div>
 <div className="flex items-baseline gap-2 mt-2">
 <span className="text-6xl font-black text-[#143D60] drop-">
 {(carbonReductionKg ?? 0).toFixed(2)}
 </span>
 <span className="text-xl font-bold text-slate-400 uppercase tracking-widest">kg CO₂</span>
 </div>
 </div>
 <div className="w-14 h-14 bg-slate-50 rounded-[20px] flex items-center justify-center border border-slate-200 ">
 <Leaf size={28} className="text-[#143D60]" fill="#143D60" />
 </div>
 </div>
 <div className="bg-white p-4 rounded-3xl border-[0.5px] border-slate-100 mt-8 ">
 <p className="text-sm font-bold text-slate-600 leading-relaxed">
 🌿 {`${monthLabel ?? "이번 달"} 친환경 매직 파워로 요정 나무를 살리고 `}
 <span className="text-[#A0C878] font-black">{rewardPoint ?? 0} 포인트</span>
 {` 를 득템했어요!`}
 </p>
 </div>
 </div>
 <Leaf size={200} className="absolute -bottom-12 -right-12 text-[#143D60]/5 -rotate-12 pointer-events-none" fill="currentColor" />
 </motion.div>
 );
}
