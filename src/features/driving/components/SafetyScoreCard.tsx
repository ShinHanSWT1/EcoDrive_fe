import { ShieldCheck } from "lucide-react";

interface SafetyScoreCardProps {
  score: number | null;
  snapshotDate: string | null;
  recentDistanceKm: number;
}

export function SafetyScoreCard({
  score,
  snapshotDate,
  recentDistanceKm,
}: SafetyScoreCardProps) {
  return (
    <div className="bg-white p-6 rounded-[32px] text-slate-900 border border-slate-200 shadow-sm relative overflow-hidden h-full">
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-1">Current Safety Score</div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-slate-900">{score ?? "--"}</span>
              <span className="text-lg font-bold text-slate-400">점</span>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 text-xs font-black">
            {snapshotDate ?? "--"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">3월 주행거리</div>
            <div className="text-lg font-black text-slate-900">{recentDistanceKm.toFixed(2)} km</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">누적 주행거리</div>
            <div className="text-lg font-black text-slate-900">--</div>
          </div>
        </div>
      </div>
      <ShieldCheck size={160} className="absolute -bottom-8 -right-8 text-slate-50 -rotate-12" />
    </div>
  );
}
