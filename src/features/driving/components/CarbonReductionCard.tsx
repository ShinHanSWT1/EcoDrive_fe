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
      className="bg-gradient-to-br from-emerald-400 to-teal-600 p-8 rounded-[40px] text-white shadow-[0_20px_50px_rgb(16,185,129,0.3)] relative overflow-hidden h-full border-4 border-white"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-3">
            <div className="text-emerald-50 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Leaf size={14} fill="#A7F3D0" className="text-emerald-200" />
              탄소 다이어트 쓱싹 성공!
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-6xl font-black text-white drop-shadow-sm">
                {(carbonReductionKg ?? 0).toFixed(2)}
              </span>
              <span className="text-xl font-bold text-emerald-100 uppercase tracking-widest">kg CO₂</span>
            </div>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-[20px] flex items-center justify-center backdrop-blur-md border border-white/40 shadow-inner">
            <Leaf size={28} className="text-white drop-shadow-sm" fill="#fff" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-3xl border border-white/20 mt-8 shadow-sm">
          <p className="text-sm font-bold text-emerald-50 leading-relaxed">
            🌿 {`${monthLabel ?? "이번 달"} 친환경 매직 파워로 요정 나무를 살리고 `}
            <span className="text-[#FEE500] font-black">{rewardPoint ?? 0} 포인트</span>
            {` 를 득템했어요!`}
          </p>
        </div>
      </div>
      <Leaf size={200} className="absolute -bottom-12 -right-12 text-white/5 -rotate-12 pointer-events-none" fill="currentColor" />
    </motion.div>
  );
}
