import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { SavingsChartItem } from "../dashboard.types";

type SavingsChartCardProps = {
  chartData: SavingsChartItem[];
};

export default function SavingsChartCard({ chartData }: SavingsChartCardProps) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">예상 절감 효과 변화</h3>
        <select className="bg-slate-50 border-none text-sm font-medium rounded-lg px-3 py-1 outline-none">
          <option>최근 4주</option>
          <option>최근 3개월</option>
        </select>
      </div>

      <div className="h-[250px] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
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
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={10}
              />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toLocaleString("ko-KR")}원`,
                  "누적 예상 절감액",
                ]}
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSavings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center">
            <div className="text-3xl font-black text-slate-300">--</div>
          </div>
        )}
      </div>
    </div>
  );
}
