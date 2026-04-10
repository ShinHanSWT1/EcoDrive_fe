import type { DailyDrivingData } from "../driving.types";

interface DailyDrivingDetailCardProps {
  data: DailyDrivingData;
  dateLabel: string;
}

export function DailyDrivingDetailCard({
  data,
  dateLabel,
}: DailyDrivingDetailCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="font-bold text-slate-900">{dateLabel} 주행 요약</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">오늘 총 주행거리</div>
          <div className="text-lg font-black text-slate-900">{data.totalDistance ?? "0.00km"}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">공회전 시간</div>
          <div className="text-lg font-black text-slate-900">{data.idling ?? "0분"}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">평균 속도</div>
          <div className="text-lg font-black text-slate-900">{data.avgSpeed ?? "0.00km/h"}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">최고 속도</div>
          <div className="text-lg font-black text-slate-900">{data.maxSpeed ?? "0.00km/h"}</div>
        </div>
      </div>
    </div>
  );
}
