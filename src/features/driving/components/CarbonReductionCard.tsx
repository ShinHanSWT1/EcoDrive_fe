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
 className="bg-white p-8 rounded-[40px] text-slate-900 relative overflow-hidden h-full"
 >
 <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
 
 <div className="relative z-10">
 <div className="flex justify-between items-start mb-6">
   <div className="space-y-3">
     <div className="text-slate-900 text-[15px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
       <Leaf size={14} fill="#A0C878" className="text-[#A0C878]" />
       탄소 다이어트 쓱싹 성공!
     </div>
     <div className="flex items-baseline gap-2 mt-2">
       <span className="text-6xl font-black text-[#1A5D40]">
         {(carbonReductionKg ?? 0).toFixed(2)}
       </span>
       <span className="text-xl font-bold text-[#1A5D40] uppercase tracking-widest">kg CO₂</span>
     </div>
   </div>
 </div>
 <div className="bg-white p-4 rounded-3xl mt-8">
 <p className="text-sm font-bold text-slate-900 leading-relaxed">
 🌿 {`${monthLabel ?? "이번 달"} 친환경 매직 파워로 요정 나무를 살리고 `}
 <span className="text-slate-900 font-black">{rewardPoint ?? 0} 포인트</span>
 {` 를 득템했어요!`}
 </p>
 </div>
 </div>
 <Leaf size={200} className="absolute -bottom-12 -right-12 text-slate-900/5 -rotate-12 pointer-events-none" fill="currentColor" />
 </motion.div>
 );
}
