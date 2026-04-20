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
     className="p-8 md:p-10 rounded-[40px] relative overflow-hidden"
    style={{ background: "linear-gradient(135deg, #DDEB9D, #A0C878)" }}
   >
     <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>

     <div className="flex flex-col gap-6 mb-10 relative z-10 lg:flex-row lg:items-end lg:justify-between">
       <div>
         <div className="text-[10px] text-slate-900 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 bg-[#A0C878]/10 w-fit px-3 py-1 rounded-full ">
           <MapPin size={14} className="text-amber-600" /> 오늘의 요정 주행 일기
         </div>
         <h3 className="font-black text-3xl md:text-4xl text-slate-900 tracking-tight">
           신나는 드라이브 기록
         </h3>
       </div>
       <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
         <label className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-2 text-sm font-bold text-slate-700 transition cursor-pointer">
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
           className="rounded-2xl bg-white/60 px-5 py-2.5 text-sm font-black text-slate-900 transition-colors hover:bg-[#143D60] hover:text-white disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-slate-900/40 flex-shrink-0"
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
