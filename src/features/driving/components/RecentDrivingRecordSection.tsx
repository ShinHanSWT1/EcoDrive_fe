import type { DailyDrivingData } from "../driving.types";
import { DailyDrivingDetailCard } from "./DailyDrivingDetailCard";
import { DrivingBehaviorStats } from "./DrivingBehaviorStats";

interface RecentDrivingRecordSectionProps {
  selectedDate: string;
  selectedDailyData: DailyDrivingData;
  minDate?: string;
  maxDate: string;
  onDateChange: (date: string) => void;
  onGoToToday: () => void;
  isTodaySelected: boolean;
}

export function RecentDrivingRecordSection({
  selectedDate,
  selectedDailyData,
  minDate,
  maxDate,
  onDateChange,
  onGoToToday,
  isTodaySelected,
}: RecentDrivingRecordSectionProps) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
      <div className="flex flex-col gap-4 mb-8 px-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="font-black text-2xl text-slate-900 mb-1">
            오늘 주행 기록
          </h3>
          <p className="text-sm text-slate-400 font-medium">
            날짜를 선택해 확인하고 오늘 버튼으로 다시 오늘 기록으로 돌아올 수 있습니다.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600">
            <span>날짜 선택</span>
            <input
              type="date"
              value={selectedDate}
              min={minDate}
              max={maxDate}
              onChange={(event) => onDateChange(event.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none"
            />
          </label>
          <button
            type="button"
            onClick={onGoToToday}
            disabled={isTodaySelected}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            오늘
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <DailyDrivingDetailCard data={selectedDailyData} dateLabel={selectedDate} />
        <div className="pt-4 border-t border-slate-50">
          <DrivingBehaviorStats data={selectedDailyData} />
        </div>
      </div>
    </div>
  );
}
