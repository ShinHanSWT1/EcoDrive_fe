import { BarChart3 } from "lucide-react";
import type { MonthOption, WeeklySummaryItem } from "../driving.types";

interface WeeklyDrivingSummarySectionProps {
  availableMonthOptions: MonthOption[];
  selectedMonthKey: string;
  weeklySummaries: WeeklySummaryItem[];
  selectedWeekKey: string;
  selectedWeeklySummary: WeeklySummaryItem | null;
  onMonthChange: (monthKey: string) => void;
  onWeekChange: (weekKey: string) => void;
}

export function WeeklyDrivingSummarySection({
  availableMonthOptions,
  selectedMonthKey,
  weeklySummaries,
  selectedWeekKey,
  selectedWeeklySummary,
  onMonthChange,
  onWeekChange,
}: WeeklyDrivingSummarySectionProps) {
  function formatWeekRange(startDate: string | null, endDate: string | null) {
    if (!startDate || !endDate) {
      return "기간 정보 없음";
    }

    const start = startDate.slice(5).replace("-", ".");
    const end = endDate.slice(5).replace("-", ".");
    return `${start} ~ ${end}`;
  }

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
      <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="font-black text-2xl text-slate-900 mb-1">
            주차별 주행데이터 요약
          </h3>
          <p className="text-sm text-slate-400 font-medium">
            보고 싶은 주차를 선택해 평균 주행 데이터를 확인하세요.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <BarChart3 size={20} />
          </div>
          <select
            value={selectedMonthKey}
            onChange={(event) => onMonthChange(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 outline-none"
          >
            {availableMonthOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={selectedWeekKey}
            onChange={(event) => onWeekChange(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 outline-none"
            disabled={weeklySummaries.length === 0}
          >
            {weeklySummaries.map((item) => (
              <option key={item.weekKey} value={item.weekKey}>
                {item.label} ({formatWeekRange(item.startDate, item.endDate)})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 text-xs font-semibold text-slate-500">
        선택 주차 기간: {formatWeekRange(selectedWeeklySummary?.startDate ?? null, selectedWeeklySummary?.endDate ?? null)}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
            총 주행거리
          </div>
          <div className="text-lg font-black text-slate-900">
            {selectedWeeklySummary?.totalDistance ?? "0.00km"}
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
            평균 주행거리
          </div>
          <div className="text-lg font-black text-slate-900">
            {selectedWeeklySummary?.averageDistance ?? "0.00km"}
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
            평균 공회전
          </div>
          <div className="text-lg font-black text-slate-900">
            {selectedWeeklySummary?.averageIdling ?? "0분"}
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
            평균 속도
          </div>
          <div className="text-lg font-black text-slate-900">
            {selectedWeeklySummary?.averageSpeed ?? "0.00km/h"}
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
            최고 속도
          </div>
          <div className="text-lg font-black text-slate-900">
            {selectedWeeklySummary?.maxSpeed ?? "0.00km/h"}
          </div>
        </div>
      </div>
    </div>
  );
}
