import {
 ResponsiveContainer,
 AreaChart,
 Area,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
} from "recharts";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { SavingsChartItem } from "../dashboard.types";

type SavingsChartCardProps = {
 chartData: SavingsChartItem[];
};

export default function SavingsChartCard({ chartData }: SavingsChartCardProps) {
 const ref = useRef(null);
 // Recharts의 애니메이션이 뷰포트 진입 시점마다 시작되도록 isInView 활용
 const isInView = useInView(ref, { once: false, margin: "-50px" });

 // 데이터에 맞춰서 5만원 단위로 tick 생성
 const maxVal = chartData.length > 0 ? Math.max(...chartData.map(d => d.savings)) : 0;
 const ceiling = Math.max(Math.ceil(maxVal / 50000) * 50000, 50000); // 최소 5만까지는 표시
 const ticks = Array.from({ length: (ceiling / 50000) + 1 }, (_, i) => i * 50000);

 return (
 <motion.div 
 ref={ref}
 initial={{ opacity: 0, scale: 0.95, y: 30 }}
 whileInView={{ opacity: 1, scale: 1, y: 0 }}
 viewport={{ once: false, margin: "-50px" }}
 whileHover={{ y: -5, transition: { duration: 0.2 } }}
 transition={{ type: "spring", stiffness: 300, damping: 20 }}
 className="bg-white p-8 rounded-[40px] border border-slate-100 cursor-pointer w-full h-full"
 >
 <div className="flex justify-between items-center mb-6">
   <h3 className="font-black text-2xl text-slate-900">예상 절감 효과 변화</h3>
   <select className="bg-[#DDEB9D]/30 text-[#143D60] border-none text-sm font-bold rounded-xl px-4 py-2 outline-none cursor-pointer"> <option>최근 4주</option>
 <option>최근 3개월</option>
 </select>
 </div>

 <div className="h-[250px] min-h-[250px] w-full" role="img" aria-label="예상 보험료 절감액의 주간 변화를 나타내는 영역형 차트입니다.">
 {chartData.length > 0 ? (
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={isInView ? chartData : []}>
 <defs>
 </defs>
 <CartesianGrid
 strokeDasharray="3 3"
 vertical={false}
 stroke="#f1f5f9"
 />
 <XAxis
 dataKey="name"
 axisLine={false}
 tickLine={false}
 tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: "bold" }}
 dy={10}
 />
 <YAxis 
 axisLine={false}
 tickLine={false}
 tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "bold" }}
 tickFormatter={(value) => value === 0 ? "0" : `${(value / 10000).toLocaleString()}만`}
 width={50}
 ticks={ticks}
 domain={[0, ceiling]}
 />
 <Tooltip
 formatter={(value: number) => [
 `${value.toLocaleString("ko-KR")}원`,
 "누적 예상 절감액",
 ]}
 contentStyle={{
 borderRadius: "20px",
 border: "none",
 boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
 fontWeight: "bold"
 }}
 />
 <Area
 type="monotone"
 dataKey="savings"
 stroke="#27667B"
 strokeWidth={4}
 fillOpacity={0.4}
 fill="#DDEB9D"
 isAnimationActive={true}
 animationDuration={1500}
 animationEasing="ease-out"
 />
 </AreaChart>
 </ResponsiveContainer>
 ) : (
 <div className="flex h-full items-center justify-center rounded-[30px] border-2 border-dashed border-slate-200 bg-slate-50 text-center">
 <div className="text-3xl font-black text-slate-300">--</div>
 </div>
 )}
 </div>
 </motion.div>
 );
}
