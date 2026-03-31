export function DailyDrivingDetailCard({ data, day }: { data: any, day: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="font-bold text-slate-900">3월 2{['일', '월', '화', '수', '목', '금', '토'].indexOf(day)}일 ({day}) 주행 요약</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">공회전 시간</div>
          <div className="text-lg font-black text-slate-900">{data.idling}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">평균 속도</div>
          <div className="text-lg font-black text-slate-900">{data.avgSpeed}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">최고 속도</div>
          <div className="text-lg font-black text-slate-900">{data.maxSpeed}</div>
        </div>
      </div>
    </div>
  );
}
