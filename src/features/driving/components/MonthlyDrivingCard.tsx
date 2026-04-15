import { TrendingDown, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";
import type { MonthlyHistoryItem, MonthlySummaryData } from "../driving.types";

interface MonthlyDrivingCardProps {
  monthlyHistory: MonthlyHistoryItem[];
  monthlySummaryData: MonthlySummaryData | null;
}

export function MonthlyDrivingCard({
  monthlyHistory,
  monthlySummaryData,
}: MonthlyDrivingCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="text-2xl font-black text-slate-900 mb-1">
            {monthlySummaryData
              ? `${monthlySummaryData.label} 누적 ${monthlySummaryData.totalDistance} 달렸어요`
              : "선택한 월 누적 -- 달렸어요"}
          </div>
          <div className="flex items-center gap-3 text-sm font-bold">
            {monthlyHistory.length > 1 ? (
              <>
                <span className="text-blue-600 flex items-center gap-1">
                  최근 6개월 흐름 비교 가능 <TrendingDown size={14} />
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-400">선택한 월 기준 최근 6개월 집계</span>
              </>
            ) : (
              <span className="text-slate-400">
                {monthlySummaryData
                  ? `${monthlySummaryData.label} ${monthlySummaryData.dayCount ?? "--"}일 / ${monthlySummaryData.sessionCount ?? "--"}세션 기준 집계`
                  : "월별 데이터가 반영되면 자동으로 집계됩니다."}
              </span>
            )}
          </div>
        </div>
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <BarChart3 size={20} />
        </div>
      </div>

      <div className="h-[160px] w-full">
        {monthlyHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyHistory}
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
              <Bar dataKey="distance" radius={[6, 6, 0, 0]} barSize={24}>
                {monthlyHistory.map((entry) => (
                  <Cell
                    key={entry.yearMonthKey}
                    fill={entry.isSelected ? "#3b82f6" : "#e2e8f0"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-3xl font-black text-slate-300">
            --
          </div>
        )}
      </div>
    </div>
  );
}
