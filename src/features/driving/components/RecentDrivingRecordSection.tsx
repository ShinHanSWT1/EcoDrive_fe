import type { DailyDrivingData } from "../driving.types";
import { DailyDrivingDetailCard } from "./DailyDrivingDetailCard";
import { DrivingBehaviorStats } from "./DrivingBehaviorStats";
import { CalendarDays, MapPin } from "lucide-react";
import { motion } from "motion/react";

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FEE500] p-8 md:p-10 rounded-[40px] border-4 border-white shadow-[0_20px_50px_rgb(254,229,0,0.3)] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col gap-6 mb-10 relative z-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-[10px] text-[#191600]/60 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 bg-white/30 backdrop-blur-sm w-fit px-3 py-1 rounded-full shadow-inner">
            <MapPin size={14} className="text-amber-600" /> 오늘의 요정 주행 일기
          </div>
          <h3 className="font-black text-3xl md:text-4xl text-[#191600] tracking-tight">
            신나는 드라이브 기록
          </h3>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-3 rounded-2xl border-4 border-white bg-white/70 backdrop-blur-md px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-white cursor-pointer">
            <CalendarDays size={18} className="text-blue-500" />
            <input
              type="date"
              value={selectedDate}
              min={minDate}
              max={maxDate}
              onChange={(event) => onDateChange(event.target.value)}
              className="bg-transparent font-black text-slate-800 outline-none cursor-pointer"
            />
          </label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onGoToToday}
            disabled={isTodaySelected}
            className="rounded-2xl border-4 border-white bg-slate-900 px-5 py-2.5 text-sm font-black text-white shadow-md transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-slate-400 disabled:border-slate-300 disabled:text-slate-200 flex-shrink-0"
          >
            오늘로 뿅!
          </motion.button>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <DailyDrivingDetailCard data={selectedDailyData} dateLabel={selectedDate} />
        <DrivingBehaviorStats data={selectedDailyData} />
      </div>
    </motion.div>
  );
}
