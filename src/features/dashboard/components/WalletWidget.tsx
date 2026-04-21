import { Gift, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

type WalletWidgetProps = {
  pointBalance: number;
  todayEarnedPoints: number;
};

export default function WalletWidget({
  pointBalance,
  todayEarnedPoints,
}: WalletWidgetProps) {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => navigate("/payment")}
      className="bg-white border-[0.5px] border-[#A0C878] p-8 rounded-[40px] relative overflow-hidden cursor-pointer group block h-full"
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
  );
}
