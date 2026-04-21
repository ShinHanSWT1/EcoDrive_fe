import type { DailyDrivingData } from "../driving.types";
import { motion } from "motion/react";
import { Navigation, Clock, Activity, GaugeCircle } from "lucide-react";

interface DailyDrivingDetailCardProps {
 data: DailyDrivingData;
 dateLabel: string;
}

export function DailyDrivingDetailCard({
 data,
 dateLabel,
}: DailyDrivingDetailCardProps) {
 const items = [
 { label: "오늘 씽씽 달린 거리", value: data.totalDistance ?? "0.00km", icon: Navigation, color: "text-blue-500", bg: "bg-blue-50" },
 { label: "조용히 쉰 시간", value: data.idling ?? "0분", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-50" },
 { label: "보통 이 속도", value: data.avgSpeed ?? "0.00km/h", icon: Activity, color: "text-indigo-500", bg: "bg-indigo-50" },
 { label: "가장 빨랐던 순간", value: data.maxSpeed ?? "0.00km/h", icon: GaugeCircle, color: "text-amber-500", bg: "bg-amber-50" },
 ];

 return (
 <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
 {items.map((item, i) => (
 <motion.div 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.1 }}
 key={i}
 whileHover={{ y: -5, scale: 1.02 }}
 className="bg-white/60 backdrop-blur-sm p-5 rounded-[32px] flex flex-col items-center text-center group cursor-default"
 >
 <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform ${item.color}`}>
 <item.icon size={26} />
 </div>
 <div className="text-[15px] text-slate-900 font-extrabold uppercase mb-1.5 bg-white/40 px-2 py-0.5 rounded ">{item.label}</div>
 <div className="text-[25px] font-black text-slate-900 tracking-tight">{item.value}</div>
 </motion.div>
 ))}
 </div>
 );
}
