import { TrendingDown, LineChart } from "lucide-react";
import {
 ResponsiveContainer,
 BarChart,
 Bar,
 XAxis,
 Tooltip,
 Cell,
} from "recharts";
import type { MonthlyHistoryItem, MonthlySummaryData } from "../driving.types";
import { motion } from "motion/react";

interface MonthlyDrivingCardProps {
 monthlyHistory: MonthlyHistoryItem[];
 monthlySummaryData: MonthlySummaryData | null;
}

export function MonthlyDrivingCard({
 monthlyHistory,
 monthlySummaryData,
}: MonthlyDrivingCardProps) {
 return (
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="bg-white p-8 md:p-10 rounded-[50px] relative overflow-hidden group mb-12"
 >
 <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#1A5D40]/10 rounded-full blur-3xl group-hover:bg-[#1A5D40]/20 transition-colors duration-1000 -z-10"></div>

 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative z-10">
 <div>
 <div className="text-[12px] font-black uppercase tracking-widest mb-3 flex items-center gap-1.5 bg-[#1A5D40]/10 w-fit px-3 py-1.5 rounded-xl" style={{ color: '#1A5D40' }}>
 <LineChart size={14} style={{ color: '#1A5D40' }} /> 월별 쑥쑥 자라는 마법 리포트
 </div>
 <div className="text-3xl font-black text-slate-900 mb-2 tracking-tight drop-">
 {monthlySummaryData
 ? `${monthlySummaryData.label} 누적 ${monthlySummaryData.totalDistance} 달렸어요 🚘`
 : "선택한 월 누적 -- 달렸어요 🚘"}
 </div>
 <div className="flex flex-wrap items-center gap-2 text-[13px] font-bold mt-4 bg-slate-50 p-1.5 rounded-2xl w-fit">
 {monthlyHistory.length > 1 ? (
 <>
 <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl" style={{ color: '#1A5D40' }}>
 최근 6개월 흐름 랭킹 <TrendingDown size={14} strokeWidth={3} />
 </span>
 <span className="text-slate-900 px-2">선택 월 기준 최근 6개월 데이터 집계</span>
 </>
 ) : (
 <span className="text-slate-900 bg-white px-4 py-2 rounded-xl ">
 {monthlySummaryData
 ? `${monthlySummaryData.label} ${monthlySummaryData.dayCount ?? "--"}일 / ${monthlySummaryData.sessionCount ?? "--"}세션 매직 집계 완료! ✨`
 : "요정들이 데이터를 가져오는 중입니다..."}
 </span>
 )}
 </div>
 </div>
 </div>

 <div className="h-[240px] w-full relative z-10 bg-slate-50/50 backdrop-blur-sm rounded-[32px] p-6"> {monthlyHistory.length > 0 ? (
 <ResponsiveContainer width="100%" height="100%">
 <BarChart
 data={monthlyHistory}
 margin={{ top: 20, right: 10, left: -20, bottom: 10 }}
 >
 <XAxis
 dataKey="month"
 axisLine={false}
 tickLine={false}
 tick={{ fill: "#64748b", fontSize: 13, fontWeight: 900 }}
 dy={6}
 />
 <Tooltip
 cursor={{ fill: "#f1f5f9", radius: 10 }}
 contentStyle={{
 borderRadius: "20px",
 border: "4px solid white",
 boxShadow: "0 20px 40px rgb(0 0 0 / 0.08)",
 fontSize: "14px",
 fontWeight: "900",
 padding: "16px 24px"
 }}
 itemStyle={{ color: "#1A5D40", fontWeight: "900", fontSize: '20px' }}
 labelStyle={{ color: "#94a3b8", marginBottom: "4px", fontSize: "11px", textTransform: 'uppercase' }}
 />
 <Bar dataKey="distance" radius={[12, 12, 4, 4]} barSize={48}>
 {monthlyHistory.map((entry) => (
 <Cell
 key={entry.yearMonthKey}
 fill={entry.isSelected ? "#1A5D40" : "#e2e8f0"}
 />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer> ) : (
 <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-3xl font-black text-slate-900">
 데이터 수집 중...
 </div>
 )}
 </div>
 </motion.div>
 );
}
