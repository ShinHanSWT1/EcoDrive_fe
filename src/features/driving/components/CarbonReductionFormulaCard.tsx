export function CarbonReductionFormulaCard() {
  const items = [
    { label: '공회전 감소 시간', value: '45분' },
    { label: '급가속 감소 횟수', value: '12회' },
    { label: '급감속 감소 횟수', value: '8회' },
    { label: '정속주행 비율', value: '78%' },
  ];

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-lg mb-5">탄소 절감 산정 근거</h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0">
            <span className="text-sm text-slate-500 font-medium">{item.label}</span>
            <span className="text-sm font-black text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 p-3.5 bg-emerald-50 rounded-2xl text-center">
        <p className="text-xs font-bold text-emerald-700">
          위 데이터를 바탕으로 이번 달 총 12.4kg의 탄소 절감량이 계산되었습니다.
        </p>
      </div>
    </div>
  );
}
