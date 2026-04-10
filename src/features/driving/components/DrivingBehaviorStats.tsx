import { Zap, AlertTriangle, Activity, Clock, Gauge } from "lucide-react";
import { cn } from "../../../shared/lib/utils";
import type { DailyDrivingData } from "../driving.types";

export function DrivingBehaviorStats({ data }: { data: DailyDrivingData }) {
  const items = [
    {
      label: "급가속",
      value: `${data.accel ?? 0}회`,
      icon: Zap,
      color: "text-orange-600",
      bg: "bg-orange-100/50",
    },
    {
      label: "급감속",
      value: `${data.decel ?? 0}회`,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-100/50",
    },
    {
      label: "과속",
      value: `${data.start ?? 0}회`,
      icon: Activity,
      color: "text-amber-600",
      bg: "bg-amber-100/50",
    },
    {
      label: "심야운전",
      value: data.night ?? "0회",
      icon: Clock,
      color: "text-indigo-600",
      bg: "bg-indigo-100/50",
    },
    {
      label: "공회전",
      value: data.idlingTime ?? "0분",
      icon: Gauge,
      color: "text-blue-600",
      bg: "bg-blue-100/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center",
              item.bg,
              item.color,
            )}
          >
            <item.icon size={20} />
          </div>
          <div className="text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              {item.label}
            </div>
            <div className="text-sm font-black text-slate-900">
              {item.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
