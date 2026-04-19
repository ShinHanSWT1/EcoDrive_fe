import { Zap, AlertTriangle, Activity, Clock, Gauge, Flame } from "lucide-react";
import { cn } from "../../../shared/lib/utils";
import type { DailyDrivingData } from "../driving.types";
import { motion } from "motion/react";

export function DrivingBehaviorStats({ data }: { data: DailyDrivingData }) {
  const items = [
    { label: "급가속", value: `${data.accel ?? 0}번`, icon: Zap, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
    { label: "급감속", value: `${data.decel ?? 0}번`, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
    { label: "과속", value: `${data.start ?? 0}번`, icon: Flame, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100" },
    { label: "야간 주행", value: data.night ?? "0시간", icon: Clock, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" },
    { label: "공회전 시간", value: data.idlingTime ?? "0분", icon: Gauge, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {items.map((item, i) => (
        <motion.div
          whileHover={{ y: -5, rotate: i % 2 === 0 ? 3 : -3 }}
          key={i}
          className={`flex items-center gap-4 p-4 rounded-[32px] bg-white border-4 border-dashed ${item.border} shadow-sm group`}
        >
          <div className={cn("w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner", item.bg, item.color)}>
            <item.icon size={24} />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">
              {item.label}
            </div>
            <div className="text-lg font-black text-slate-900 drop-shadow-sm">
              {item.value}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
