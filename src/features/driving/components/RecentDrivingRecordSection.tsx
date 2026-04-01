import { motion } from "motion/react";
import { cn } from "../../../shared/lib/utils";
import type { DrivingDay } from "../driving.types";
import { DailyDrivingDetailCard } from "./DailyDrivingDetailCard";
import { DrivingBehaviorStats } from "./DrivingBehaviorStats";
import { dailyHistoryData } from "../driving.mock";

interface RecentDrivingRecordSectionProps {
  selectedDay: DrivingDay;
  onDayChange: (day: DrivingDay) => void;
}

export function RecentDrivingRecordSection({
  selectedDay,
  onDayChange,
}: RecentDrivingRecordSectionProps) {
  const days: DrivingDay[] = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
      <div className="flex justify-between items-end mb-8 px-2">
        <div>
          <h3 className="font-black text-2xl text-slate-900 mb-1">
            최근 주행 기록
          </h3>
          <p className="text-sm text-slate-400 font-medium">
            일자별 상세 주행 데이터를 확인하세요
          </p>
        </div>
        <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
          Daily Analysis
        </div>
      </div>

      <div className="flex gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
        {days.map((day, idx) => (
          <button
            key={day}
            onClick={() => onDayChange(day)}
            className={cn(
              "min-w-[72px] h-24 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all duration-300 shrink-0",
              selectedDay === day
                ? "bg-blue-600 text-white shadow-xl shadow-blue-100 scale-105"
                : "bg-slate-50 text-slate-400 hover:bg-slate-100",
            )}
          >
            <span
              className={cn(
                "text-[11px] font-bold uppercase tracking-wider",
                selectedDay === day ? "text-blue-100" : "text-slate-400",
              )}
            >
              {day}
            </span>
            <span className="text-xl font-black">2{idx}</span>
            {selectedDay === day && (
              <motion.div
                layoutId="active-dot"
                className="w-1.5 h-1.5 bg-white rounded-full mt-1"
              />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        <DailyDrivingDetailCard
          data={dailyHistoryData[selectedDay]}
          day={selectedDay}
        />
        <div className="pt-4 border-t border-slate-50">
          <DrivingBehaviorStats data={dailyHistoryData[selectedDay]} />
        </div>
      </div>
    </div>
  );
}
