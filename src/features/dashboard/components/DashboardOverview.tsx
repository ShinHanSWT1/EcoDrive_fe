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
    card: "bg-white border border-slate-200 shadow-sm",
    iconWrap: "bg-slate-50 text-slate-700",
    change: "",
    label: "text-slate-500",
    value: "text-slate-900",
    subText: "text-slate-400",
  },
  orange: {
    card: "bg-white border border-slate-200 shadow-sm",
    iconWrap: "bg-orange-50 text-orange-600",
    change: "text-orange-600 bg-orange-50",
    label: "text-slate-500",
    value: "text-slate-900",
    subText: "text-orange-600",
  },
  blue: {
    card: "bg-white border border-slate-200 shadow-sm",
    iconWrap: "bg-blue-50 text-blue-600",
    change: "text-green-600 bg-green-50",
    label: "text-slate-500",
    value: "text-slate-900",
    subText: "text-slate-400",
  },
  green: {
    card: "bg-white border border-slate-200 shadow-sm",
    iconWrap: "bg-green-50 text-green-600",
    change: "text-green-600 bg-green-50",
    label: "text-slate-500",
    value: "text-slate-900",
    subText: "text-slate-400",
  },
};

function renderIcon(id: string) {
  if (id === "discount" || id === "score")
    return <ShieldCheck size={20} className="md:w-6 md:h-6" />;
  if (id === "carbon") return <Leaf size={20} className="md:w-6 md:h-6" />;
  return <Wallet size={20} className="md:w-6 md:h-6" />;
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
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 -mt-2">
        <div className="text-[10px] md:text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md w-fit">
          포인트 혜택 별도 적립 ({pointBalance.toLocaleString("ko-KR")}P)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((card, index) => {
          const tone = toneMap[card.tone];

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 md:p-6 rounded-3xl ${tone.card}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 md:p-3 rounded-2xl ${tone.iconWrap}`}>
                  {renderIcon(card.id)}
                </div>
                {card.changeText && (
                  <span
                    className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded-full ${tone.change}`}
                  >
                    {card.changeText}
                  </span>
                )}
              </div>

              <div className={`text-xs md:text-sm font-medium ${tone.label}`}>
                {card.label}
              </div>
              <div
                className={`text-2xl md:text-3xl font-bold mt-1 ${tone.value}`}
              >
                {renderValue(card)}
              </div>
              <div
                className={`text-[10px] md:text-xs font-bold mt-2 ${tone.subText}`}
              >
                {card.subText}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
