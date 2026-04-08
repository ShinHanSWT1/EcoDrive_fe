import { Info } from "lucide-react";

interface SafetyScoreCriteriaCardProps {
  snapshotDate: string | null;
  monthlyDistanceKm: number | null;
  monthLabel: string | null;
}

export function SafetyScoreCriteriaCard({
  snapshotDate,
  monthlyDistanceKm,
  monthLabel,
}: SafetyScoreCriteriaCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-6">
        <Info size={18} className="text-blue-600" />
        <h3 className="font-bold text-lg">안전 점수 산정 기준</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-slate-50">
          <span className="text-sm text-slate-500 font-medium">산정 기간</span>
          <span className="text-sm font-bold text-slate-900">
            {monthLabel ? `${monthLabel} 1일 ~ ${snapshotDate ?? "--"}` : "--"}
          </span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-slate-50">
          <span className="text-sm text-slate-500 font-medium">산정 기간 내 주행거리</span>
          <span className="text-sm font-bold text-slate-900">
            {monthlyDistanceKm != null ? `${monthlyDistanceKm.toFixed(2)}km` : "--"}
          </span>
        </div>
        <div className="pt-2">
          <p className="text-xs text-slate-400 leading-relaxed">
            안전 점수는 월초에 100점으로 시작하며, 매 주행 데이터 반영 시 급가속, 급감속, 과속, 심야운전 및 공회전 패턴을 기준으로 다시 계산됩니다. 
            특히 보험 할인 특약 기준인 85점 이상을 유지할 경우 최대 15%의 보험료 할인이 적용됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
