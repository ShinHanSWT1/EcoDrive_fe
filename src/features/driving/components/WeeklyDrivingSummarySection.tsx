import { Presentation } from "lucide-react";
import type { MonthOption, WeeklySummaryItem } from "../driving.types";
import { motion } from "motion/react";

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
 if (!startDate || !endDate) return "언제 달렸는지 몰라요";
 const start = startDate.slice(5).replace("-", ".");
 const end = endDate.slice(5).replace("-", ".");
 return `${start} ~ ${end}`;
 }

 return (
 <div className="bg-white p-8 md:p-10 rounded-[40px] border-[0.5px] border-[#143D60] relative overflow-hidden">
 <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
 
 <div className="flex flex-col gap-6 mb-10 relative z-10 xl:flex-row xl:items-end xl:justify-between">
 <div>
 <div className="text-[10px] text-[#143D60] font-extrabold uppercase tracking-widest mb-3 flex items-center gap-1.5 bg-[#A0C878]/10 w-fit px-3 py-1 rounded-full border border-[#A0C878]/30">
 <Presentation size={14} className="text-[#A0C878]" /> 에코드라이브 리포트 센터
 </div>
 <h3 className="font-black text-3xl md:text-4xl text-[#143D60] tracking-tight leading-snug">
 주차별<br className="md:hidden" /> 주행 데이터
 </h3>
 </div>
 <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
 <select
 value={selectedMonthKey}
 onChange={(event) => onMonthChange(event.target.value)}
 className="rounded-2xl border-2 border-[#143D60]/20 bg-slate-50 px-4 py-3 text-sm font-black text-[#143D60] outline-none hover:bg-slate-100 transition-colors appearance-none cursor-pointer"
 >
 {availableMonthOptions.map((option) => (
 <option key={option.key} value={option.key} className="text-slate-900 font-bold">
 {option.label}
 </option>
 ))}
 </select>
 <select
 value={selectedWeekKey}
 onChange={(event) => onWeekChange(event.target.value)}
 className="rounded-2xl border-2 border-[#143D60]/20 bg-slate-50 px-4 py-3 text-sm font-black text-[#143D60] outline-none hover:bg-slate-100 transition-colors appearance-none cursor-pointer"
 disabled={weeklySummaries.length === 0}
 >
 {weeklySummaries.map((item) => (
 <option key={item.weekKey} value={item.weekKey} className="text-slate-900 font-bold">
 {item.label} ({formatWeekRange(item.startDate, item.endDate)})
 </option>
 ))}
 </select>
 </div>
 </div>

 <div className="mb-4 inline-block bg-slate-50 text-xs font-black text-slate-500 px-3 py-1.5 rounded-xl border border-slate-200 relative z-10 ">
 선택한 마법 주간 정산: {formatWeekRange(selectedWeeklySummary?.startDate ?? null, selectedWeeklySummary?.endDate ?? null)}
 </div>

 <div className="grid grid-cols-2 gap-4 md:grid-cols-5 relative z-10">
 {[
 { label: "총 주행거리", val: selectedWeeklySummary?.totalDistance ?? "0.00km" },
 { label: "단정히 평균 거리", val: selectedWeeklySummary?.averageDistance ?? "0.00km" },
 { label: "얌전한 공회전", val: selectedWeeklySummary?.averageIdling ?? "0분" },
 { label: "평균 거북이 속도", val: selectedWeeklySummary?.averageSpeed ?? "0.00km/h" },
 { label: "최고 씽씽 속도", val: selectedWeeklySummary?.maxSpeed ?? "0.00km/h" },
 ].map((item, i) => (
 <motion.div 
 whileHover={{ y: -5, scale: 1.05 }}
 key={i}
 className="bg-slate-50 p-5 rounded-[32px] border border-[#143D60]/10 group cursor-default"
 >
 <div className="text-[10px] text-slate-400 font-black uppercase mb-1.5 tracking-widest">{item.label}</div>
 <div className="text-xl font-black text-[#143D60] group-hover:text-[#A0C878] transition-colors">{item.val}</div>
 </motion.div>
 ))}
 </div>
 </div>
 );
}
