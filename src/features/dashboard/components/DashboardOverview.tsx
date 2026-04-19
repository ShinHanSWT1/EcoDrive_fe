import { Wallet, ShieldCheck, Leaf } from "lucide-react";
import { motion } from "motion/react";
import type { DashboardStatCard } from "../dashboard.types";
import { formatCurrency } from "../../../shared/lib/format";

type DashboardOverviewProps = {
  stats: DashboardStatCard[];
  pointBalance: number;
};

const toneMap = {
  dark: {
    card: "bg-white shadow-[0_10px_30px_rgb(0,0,0,0.06)]",
    iconWrap: "bg-slate-900 text-white shadow-md shadow-slate-900/20",
    change: "text-slate-600 bg-slate-100",
    label: "text-slate-500 font-extrabold",
    value: "text-slate-900 font-black",
    subText: "text-slate-400 font-bold",
  },
  orange: {
    card: "bg-[#FFF8F3] shadow-[0_10px_30px_rgb(255,150,0,0.15)]",
    iconWrap: "bg-orange-500 text-white shadow-md shadow-orange-500/20",
    change: "text-orange-700 bg-orange-200/60",
    label: "text-orange-800/60 font-extrabold",
    value: "text-orange-950 font-black",
    subText: "text-orange-600/80 font-bold",
  },
  blue: {
    card: "bg-[#EFF6FF] shadow-[0_10px_30px_rgb(59,130,246,0.15)]",
    iconWrap: "bg-blue-600 text-white shadow-md shadow-blue-600/20",
    change: "text-blue-700 bg-blue-200/60",
    label: "text-blue-800/60 font-extrabold",
    value: "text-blue-950 font-black",
    subText: "text-blue-600/80 font-bold",
  },
  green: {
    card: "bg-[#F0FDF4] shadow-[0_10px_30px_rgb(34,197,94,0.15)]",
    iconWrap: "bg-emerald-500 text-white shadow-md shadow-emerald-500/20",
    change: "text-emerald-700 bg-emerald-200/60",
    label: "text-emerald-800/60 font-extrabold",
    value: "text-emerald-950 font-black",
    subText: "text-emerald-600/80 font-bold",
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
}: DashboardOverviewProps) {
  return (
    <>
      <motion.div 
         initial={{ opacity: 0, y: -10 }} 
         animate={{ opacity: 1, y: 0 }}
         className="flex flex-col sm:flex-row sm:items-center gap-2 -mt-2 mb-4"
      >
        <div className="text-xs md:text-sm font-black text-white bg-indigo-500 px-4 py-1.5 rounded-xl shadow-md flex items-center gap-2">
          ✨ <span>포인트 혜택 별도 적립 ({pointBalance.toLocaleString("ko-KR")}P)</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((card, index) => {
          const tone = toneMap[card.tone];

          return (
            <motion.div
              key={card.id}
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.2 } }}
              className={`p-6 md:p-8 rounded-[40px] ${tone.card} cursor-pointer relative overflow-hidden group`}
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

              <div className="relative z-10">
                <div className={`text-sm md:text-base ${tone.label} mb-1`}>
                  {card.label}
                </div>
                <div
                  className={`text-3xl md:text-4xl ${tone.value} tracking-tight`}
                >
                  {renderValue(card)}
                </div>
                <div
                  className={`text-xs md:text-sm mt-3 ${tone.subText} bg-white/50 backdrop-blur-sm inline-block px-3 py-1.5 rounded-xl`}
                >
                  {card.subText}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
