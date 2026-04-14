import { Leaf, Navigation, Zap, Fuel } from "lucide-react";
import { cn } from "../../../shared/lib/utils";

interface CarbonReductionEquivalenceCardProps {
  carbonReductionKg: number | null;
}

export function CarbonReductionEquivalenceCard({
  carbonReductionKg,
}: CarbonReductionEquivalenceCardProps) {
  const normalizedCarbonReductionKg = carbonReductionKg ?? 0;
  const treeMonths = Math.max(normalizedCarbonReductionKg / 0.7, 0);
  const drivingKm = Math.max(normalizedCarbonReductionKg / 0.16, 0);
  const gasolineLiters = Math.max(normalizedCarbonReductionKg / 2.31, 0);
  const electricityKwh = Math.max(normalizedCarbonReductionKg / 0.424, 0);

  const items = [
    {
      title: "나무 흡수량 기준",
      value: `${treeMonths.toFixed(1)}개월`,
      label: "도심 나무 1그루가 흡수하는 기간과 비슷합니다.",
      icon: Leaf,
      color: "text-emerald-600",
      bg: "bg-emerald-100/60",
    },
    {
      title: "주행 배출량 기준",
      value: `${drivingKm.toFixed(1)}km`,
      label: "자동차 주행 시 발생하는 배출량 기준으로 환산한 값입니다.",
      icon: Navigation,
      color: "text-blue-600",
      bg: "bg-blue-100/60",
    },
    {
      title: "휘발유 사용량 기준",
      value: `${gasolineLiters.toFixed(2)}L`,
      label: "휘발유 사용 과정에서 배출되는 탄소량으로 환산할 수 있습니다.",
      icon: Fuel,
      color: "text-orange-600",
      bg: "bg-orange-100/60",
    },
    {
      title: "전력 사용량 기준",
      value: `${electricityKwh.toFixed(2)}kWh`,
      label: "전력 소비에 따른 배출량 기준으로도 비교해볼 수 있습니다.",
      icon: Zap,
      color: "text-indigo-600",
      bg: "bg-indigo-100/60",
    },
  ];

  return (
    <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 sm:p-8">
      <div className="mb-8">
        <h3 className="text-xl font-black text-emerald-900">
          이번 활동으로 줄인 <span className="text-3xl">{normalizedCarbonReductionKg.toFixed(2)}kg CO₂</span>는
        </h3>
        <p className="text-sm text-emerald-600/70 font-medium">
          일상 속에서 다음과 같은 가치와 비슷합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-white border border-emerald-100/60 p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                  item.bg,
                  item.color,
                )}
              >
                <item.icon size={22} />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  {item.title}
                </div>
                <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  {item.value}
                </div>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                  {item.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
