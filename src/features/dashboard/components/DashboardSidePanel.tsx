import { Car, Info, TrendingDown, ChevronRight, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TodayDrivingSummaryItem } from "../dashboard.types";

type DashboardSidePanelProps = {
  pointBalance: number;
  todayEarnedPoints: number;
  summaryNote: string;
  todayDrivingSummary: TodayDrivingSummaryItem[];
};

export default function DashboardSidePanel({
  pointBalance,
  todayEarnedPoints,
  summaryNote,
  todayDrivingSummary,
}: DashboardSidePanelProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-2xl bg-slate-50 text-slate-700">
            <Wallet size={20} />
          </div>
          <button
            type="button"
            onClick={() => navigate("/payment")}
            className="text-[10px] text-blue-600 font-bold flex items-center gap-1"
          >
            상세보기 <ChevronRight size={10} />
          </button>
        </div>

        <div className="text-sm font-medium text-slate-500">보유 포인트</div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-bold text-slate-900">
            {pointBalance.toLocaleString("ko-KR")}
          </span>
          <span className="text-sm font-bold text-slate-400">P</span>
        </div>

        <div className="mt-2 text-xs font-bold text-slate-400">
          오늘 {todayEarnedPoints.toLocaleString("ko-KR")}포인트 적립 되었습니다.
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
            {summaryNote}
          </div>
        </div>
      </div>
    </div>
  );
}
