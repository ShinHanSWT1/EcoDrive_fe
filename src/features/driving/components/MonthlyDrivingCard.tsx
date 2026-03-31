import { TrendingDown, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";
import { monthlyHistoryData } from "../driving.mock";

export function MonthlyDrivingCard() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="text-2xl font-black text-slate-900 mb-1">
            3월간 총 2,289km 달렸어요
          </div>
          <div className="flex items-center gap-3 text-sm font-bold">
            <span className="text-blue-600 flex items-center gap-1">
              지난 2월보다 <TrendingDown size={14} /> 217km
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400">최근 6개월 평균 2,665km</span>
          </div>
        </div>
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <BarChart3 size={20} />
        </div>
      </div>

      <div className="h-[160px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyHistoryData}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="distance" radius={[6, 6, 0, 0]} barSize={32}>
              {monthlyHistoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === monthlyHistoryData.length - 1
                      ? "#3b82f6"
                      : "#e2e8f0"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
