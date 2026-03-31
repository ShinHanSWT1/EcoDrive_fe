import { Car, Info, TrendingDown, ChevronRight } from "lucide-react";
import type { TodayDrivingSummaryItem } from "../dashboard.types";

type DashboardSidePanelProps = {
  pointBalance: number;
  expectedWeeklyPoints: number;
  todayDrivingSummary: TodayDrivingSummaryItem[];
};

export default function DashboardSidePanel({
  pointBalance,
  expectedWeeklyPoints,
  todayDrivingSummary,
}: DashboardSidePanelProps) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm text-slate-600">보유 포인트</h3>
          <button className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
            상세보기 <ChevronRight size={10} />
          </button>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-slate-900">
            {pointBalance.toLocaleString("ko-KR")}
          </span>
          <span className="text-xs font-bold text-slate-400">P</span>
        </div>

        <div className="mt-3 text-[10px] text-slate-500 font-medium">
          이번 주{" "}
          <span className="text-blue-600 font-bold">
            {expectedWeeklyPoints.toLocaleString("ko-KR")}P
          </span>{" "}
          적립 예정
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="font-bold mb-4">오늘의 주행 요약</h3>

        <div className="space-y-4">
          {todayDrivingSummary.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500">
                {item.icon === "car" ? (
                  <Car size={20} />
                ) : (
                  <TrendingDown size={20} />
                )}
              </div>

              <div className="flex-1">
                <div className="text-sm font-bold">{item.title}</div>
                <div className="text-xs text-slate-500">{item.description}</div>
              </div>

              <div
                className={`text-sm font-bold ${
                  item.statusTone === "danger"
                    ? "text-red-500"
                    : "text-blue-600"
                }`}
              >
                {item.statusText}
              </div>
            </div>
          ))}

          <div className="p-3 bg-blue-50 rounded-2xl text-[11px] text-blue-700 font-medium leading-relaxed">
            <Info size={14} className="inline mr-1 mb-0.5" />
            정속 주행 비율이 높아 탄소 배출을{" "}
            <span className="font-bold">0.8kg</span> 줄였습니다.
          </div>
        </div>
      </div>
    </div>
  );
}
