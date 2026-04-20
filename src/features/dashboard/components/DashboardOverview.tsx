import { Wallet, ShieldCheck, Leaf } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import type { DashboardStatCard } from "../dashboard.types";
import { formatCurrency } from "../../../shared/lib/format";

type DashboardOverviewProps = {
  stats: DashboardStatCard[];
  pointBalance: number;
  todayEarnedPoints: number;
};

const toneMap = {
  dark: {
    card: "bg-white border-b-2 border-slate-200 shadow-sm",
    iconWrap: "bg-slate-100 text-slate-800",
    change: "text-slate-800 bg-slate-100",
    label: "text-slate-500 font-bold",
    value: "text-slate-900 font-black",
    subText: "text-slate-600 font-bold",
  },
  orange: {
    card: "bg-white border-b-2 border-orange-200 shadow-sm",
    iconWrap: "bg-orange-50 text-orange-600",
    change: "text-orange-600 bg-orange-50",
    label: "text-slate-500 font-bold",
    value: "text-slate-900 font-black",
    subText: "text-orange-600 font-bold",
  },
  point: {
    card: "bg-[#A0C878] border-b-4 border-[#1A5D40] shadow-sm",
    iconWrap: "bg-white/30 text-slate-900",
    change: "text-slate-900 bg-white/30",
    label: "text-slate-900/70 font-bold",
    value: "text-slate-900 font-black",
    subText: "text-slate-900/80 font-bold",
  },
  blue: {
    card: "bg-white border-b-2 border-blue-600 shadow-sm",
    iconWrap: "bg-blue-50 text-blue-600",
    change: "text-blue-600 bg-blue-50",
    label: "text-slate-500 font-bold",
    value: "text-slate-900 font-black",
    subText: "text-blue-600 font-bold",
  },
  green: {
    card: "bg-white border-b-2 border-emerald-600 shadow-sm",
    iconWrap: "bg-emerald-50 text-emerald-600",
    change: "text-emerald-600 bg-emerald-50",
    label: "text-slate-500 font-bold",
    value: "text-slate-900 font-black",
    subText: "text-emerald-600 font-bold",
  },
};

function renderIcon(id: string) {
  if (id === "discount" || id === "score")
    return <ShieldCheck size={24} className="md:w-8 md:h-8" />;
  if (id === "carbon") return <Leaf size={24} className="md:w-8 md:h-8" />;
  return <Wallet size={24} className="md:w-8 md:h-8" />;
}

function renderValue(card: DashboardStatCard) {
  if (typeof card.value === "number") {
    return formatCurrency(card.value);
  }
  return card.value;
}

export default function DashboardOverview({
  stats,
  pointBalance,
  todayEarnedPoints,
}: DashboardOverviewProps) {
  const navigate = useNavigate();

  // 포인트 카드를 데이터 구조에 맞춰 생성
  const walletCard: DashboardStatCard = {
    id: "wallet",
    label: "보유 포인트",
    value: pointBalance,
    subText: `오늘 🎉 ${(todayEarnedPoints ?? 0).toLocaleString("ko-KR")}P 적립!`,
    tone: "point",
  };

  // 포인트 카드를 가장 앞에 삽입
  const displayStats = [walletCard, ...stats];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-start items-end">
        {displayStats.map((card, index) => {
          const tone = toneMap[card.tone as keyof typeof toneMap] || toneMap.orange;

          return (
            <div key={card.id} className="flex flex-col gap-4 flex-1 min-w-[200px]">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 40 }}                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.2 } }}
                onClick={card.id === "wallet" ? () => navigate("/payment") : undefined}
                className={`p-5 md:p-6 rounded-[40px] ${tone.card} cursor-pointer relative overflow-hidden group h-full`}
              >
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className={`p-4 rounded-[20px] ${tone.iconWrap} group-hover:rotate-12 transition-transform`}>
                    {renderIcon(card.id)}
                  </div>
                  {card.changeText && (
                    <span
                      className={`text-xs md:text-sm font-black px-3 py-1.5 rounded-full ${tone.change}`}
                    >
                      {card.changeText}
                    </span>
                  )}
                </div>

                <div className="relative z-10 text-left">
                  <div className={`text-sm md:text-base ${tone.label} mb-1`}>
                    {card.label}
                  </div>
                  <div
                    className={`text-3xl md:text-4xl ${tone.value} tracking-tight`}
                  >
                    {renderValue(card)}
                  </div>
                  <div
                    className={`text-[15px] md:text-[17px] mt-3 ${tone.subText} bg-white/50 backdrop-blur-sm block w-fit -ml-3 px-3 py-1.5 rounded-xl text-left`}
                  >
                    {card.subText}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
