import { Car, Info, TrendingDown, Gauge, Zap, Timer } from "lucide-react";
import { motion } from "motion/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { TodayDrivingSummaryItem } from "../dashboard.types";

type DrivingSummaryWidgetProps = {
  summaryNote: string;
  todayDrivingSummary: TodayDrivingSummaryItem[];
  metrics?: {
    totalDistance: number;
    avgSpeed: number;
    maxSpeed: number;
    idlingTime: number;
    ecoScore: number;
  };
};

export default function DrivingSummaryWidget({
  summaryNote = "이번 달은 평소보다 경제적인 운전을 하셨네요! 탄소 배출을 12% 절감하셨습니다. ✨",
  metrics = {
    totalDistance: 124.5,
    avgSpeed: 42.8,
    maxSpeed: 110.2,
    idlingTime: 12,
    ecoScore: 92,
  },
}: DrivingSummaryWidgetProps) {
  const chartData = [
    { name: "score", value: metrics.ecoScore || 92 },
    { name: "rest", value: 100 - (metrics.ecoScore || 92) },
  ];

  const COLORS = ["#A0C878", "#F1F5F9"];

  const formatValue = (val: number, unit: string) => {
    return `${val} ${unit}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.3 }}
      className="bg-white p-8 md:p-10 rounded-[40px] relative h-full border border-slate-100 overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

        {/* Left Side: Stats Grid */}
        <div className="flex-1 w-full">
          <h3 className="font-black text-2xl mb-8 text-slate-900">총 주행거리 요약</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Car, label: "총 주행거리", value: formatValue(metrics.totalDistance, "km"), color: "bg-blue-50 text-blue-600" },
              { icon: Gauge, label: "평균 속도", value: formatValue(metrics.avgSpeed, "km/h"), color: "bg-emerald-50 text-emerald-600" },
              { icon: Zap, label: "최고 속도", value: formatValue(metrics.maxSpeed, "km/h"), color: "bg-orange-50 text-orange-600" },
              { icon: Timer, label: "공회전 시간", value: formatValue(metrics.idlingTime, "분"), color: "bg-purple-50 text-purple-600" },
            ].map((stat, i) => (              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-400 mb-1">{stat.label}</div>
                  <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mt-10 p-5 bg-blue-50/50 rounded-[28px] text-sm text-[#143D60] font-bold leading-relaxed border border-blue-100/50 flex items-start gap-3 max-w-2xl"
          >
            <Info size={18} className="flex-shrink-0 mt-0.5 text-blue-500" />
            <div>{summaryNote}</div>
          </motion.div>
        </div>

        {/* Right Side: Circular Chart */}
        <div className="w-full lg:w-72 h-72 relative flex flex-col items-center justify-center">
          <div className="absolute top-2 left-0 right-0 text-center text-sm font-black text-slate-400 uppercase tracking-widest">
            안전운전 지수
          </div>
          
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={110}
                  startAngle={225}
                  endAngle={-45}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} cornerRadius={10} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
            <span className="text-5xl font-black text-slate-900">{metrics.ecoScore || 92}점</span>
            <span className="text-sm font-extrabold text-[#A0C878] mt-1">Excellent</span>
          </div>

          <div className="absolute bottom-4 text-center">
             <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">오늘의 주행 데이터 기준</div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
