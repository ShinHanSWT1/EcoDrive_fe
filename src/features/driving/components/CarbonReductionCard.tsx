import { Leaf } from 'lucide-react';

export function CarbonReductionCard() {
  return (
    <div className="bg-emerald-500 p-6 rounded-[32px] text-white shadow-lg shadow-emerald-100 relative overflow-hidden h-full">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-2">Carbon Reduction Achievement</div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black drop-shadow-sm">12.4</span>
              <span className="text-xl font-bold text-emerald-100">kg CO₂</span>
            </div>
          </div>
          <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
            <Leaf size={22} className="text-white" />
          </div>
        </div>
        <p className="text-sm font-medium text-emerald-50 leading-relaxed max-w-[240px]">
          이번 달 친환경 운전으로 탄소 배출량을 줄이고 포인트를 적립했습니다.
        </p>
      </div>
      <Leaf size={164} className="absolute -bottom-9 -right-9 text-white/10 -rotate-12" />
    </div>
  );
}
