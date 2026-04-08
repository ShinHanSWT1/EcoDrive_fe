import { TrendingDown, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";
import type { DrivingRecentSession } from "../driving.api";
import type { MonthlyHistoryItem } from "../driving.types";

interface MonthlyDrivingCardProps {
  recentSessions: DrivingRecentSession[];
  monthlyHistory: MonthlyHistoryItem[];
}

export function MonthlyDrivingCard({
  recentSessions,
  monthlyHistory,
}: MonthlyDrivingCardProps) {
  const currentMonthDistance = recentSessions.reduce(
    (sum, session) => sum + session.distanceKm,
    0,
  );
  const currentMonthLabel =
    recentSessions.length > 0
      ? `${new Date(recentSessions[0].sessionDate).getMonth() + 1}월`
      : "이번 달";

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="text-2xl font-black text-slate-900 mb-1">
            {currentMonthLabel} 누적 {currentMonthDistance.toFixed(2)}km 달렸어요
          </div>
          <div className="flex items-center gap-3 text-sm font-bold">
            {monthlyHistory.length > 1 ? (
              <>
                <span className="text-blue-600 flex items-center gap-1">
                  최근 반영 월과 비교 가능 <TrendingDown size={14} />
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-400">현재 반영 데이터 기준 집계</span>
              </>
            ) : (
              <span className="text-slate-400">
                월별 비교 지표는 데이터가 더 쌓이면 자동 반영됩니다.
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
              <Bar dataKey="distance" radius={[6, 6, 0, 0]} barSize={32}>
                {monthlyHistory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === monthlyHistory.length - 1
                        ? "#3b82f6"
                        : "#e2e8f0"
                    }
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
