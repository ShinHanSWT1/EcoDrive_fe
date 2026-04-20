interface CarbonReductionFormulaCardProps {
 carbonReductionKg: number | null;
 totalIdlingTimeMinutes: number | null;
 rapidAccelCount: number | null;
 hardBrakeCount: number | null;
 steadyDrivingRatio: number | null;
}

export function CarbonReductionFormulaCard({
 carbonReductionKg,
 totalIdlingTimeMinutes,
 rapidAccelCount,
 hardBrakeCount,
 steadyDrivingRatio,
}: CarbonReductionFormulaCardProps) {
 const items = [
 {
 label: "공회전 시간",
 value: `${totalIdlingTimeMinutes ?? 0}분`,
 hint: "엔진이 불필요하게 켜져 있는 시간",
 },
 {
 label: "급가속 횟수",
 value: `${rapidAccelCount ?? 0}회`,
 hint: "가속 패턴이 크게 변한 횟수",
 },
 {
 label: "급감속 횟수",
 value: `${hardBrakeCount ?? 0}회`,
 hint: "제동 패턴이 크게 변한 횟수",
 },
 {
 label: "정속주행 비율",
 value: `${(steadyDrivingRatio ?? 0).toFixed(2)}%`,
 hint: "안정적으로 속도를 유지한 비율",
 },
 ];

 return (
 <div className="bg-white p-5 rounded-3xl sm:p-6">
 <div className="pb-5">
 <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-900">
 Driving Pattern
 </div>
 <h3 className="mt-2 font-bold text-lg text-slate-900">이번 달 주행 패턴 요약</h3>
 <p className="mt-2 text-sm font-medium leading-relaxed text-slate-900">
 탄소 절감량 산정에 반영되는 주요 주행 지표를 한눈에 볼 수 있도록 정리했습니다.
 </p>
 </div>

 <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
 {items.map((item) => (
 <div
 key={item.label}
 className="rounded-2xl bg-slate-50 px-4 py-4"
 >
 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0">
 <div className="text-sm font-bold text-slate-900">{item.label}</div>
 <div className="mt-1 text-xs font-semibold text-slate-900">
 {item.hint}
 </div>
 </div>
 <div className="rounded-2xl bg-white px-3 py-2 text-right ">
 <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900">
 Current
 </div>
 <div className="mt-1 text-lg font-black text-slate-950">{item.value}</div>
 </div>
 </div>
 </div>
 ))}
 </div>

 <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-4">
 <p className="text-sm font-bold text-slate-900">
 위 주행 지표를 기준으로 이번 달 총 {(carbonReductionKg ?? 0).toFixed(2)}kg의 탄소 절감량이 계산되었습니다.
 </p>
 </div>
 </div>
 );
}
