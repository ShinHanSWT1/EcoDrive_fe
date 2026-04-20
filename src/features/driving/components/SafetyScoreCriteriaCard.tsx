import { Info } from "lucide-react";

interface SafetyScoreCriteriaCardProps {
 periodLabel: string | null;
 monthlyDistanceKm: number | null;
}

export function SafetyScoreCriteriaCard({
 periodLabel,
 monthlyDistanceKm,
}: SafetyScoreCriteriaCardProps) {
 return (
 <div className="bg-white p-8 rounded-[30px] h-full shadow-sm">
 <div className="flex items-center gap-2 mb-6">
 <Info size={18} className="text-blue-600" />
 <h3 className="font-bold text-lg">안전 점수 산정 기준</h3>
 </div>
 
 <div className="space-y-4">
 <div className="flex justify-between items-center py-4">
 <span className="text-[17px] text-slate-900 font-black">산정 기간</span>
 <span className="text-[17px] font-black text-slate-900">
 {periodLabel ?? "--"}
 </span>
 </div>
 <div className="flex justify-between items-center py-4">
 <span className="text-[17px] text-slate-900 font-black">산정 기간 내 주행거리</span>
 <span className="text-[17px] font-black text-slate-900">
 {monthlyDistanceKm != null ? `${monthlyDistanceKm.toFixed(2)}km` : "--"}
 </span>
 </div>
 <div className="pt-2">
 <p className="text-[15px] text-slate-900 leading-relaxed">
 안전 점수는 월초 100점에서 시작하며, 매 주행 데이터 반영 시 급가속, 급감속, 과속 빈도를 기준으로 다시 계산됩니다.
 </p>
 </div>
 </div>
 </div>
 );
}
