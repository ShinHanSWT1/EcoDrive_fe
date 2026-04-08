import { Leaf, Navigation, Zap, Activity } from "lucide-react";
import { cn } from "../../../shared/lib/utils";

interface CarbonReductionEquivalenceCardProps {
  carbonReductionKg: number | null;
}

export function CarbonReductionEquivalenceCard({
  carbonReductionKg,
}: CarbonReductionEquivalenceCardProps) {
  const items = [
    {
      label: "도심 나무 1그루가 약 --개월 동안 흡수하는 양",
      icon: Leaf,
      color: "text-emerald-600",
      bg: "bg-emerald-100/50",
    },
    {
      label: "자동차로 약 --km 주행할 때 나오는 배출량",
      icon: Navigation,
      color: "text-blue-600",
      bg: "bg-blue-100/50",
    },
    {
      label: "휘발유 약 --L 사용 시 발생하는 배출량",
      icon: Zap,
      color: "text-orange-600",
      bg: "bg-orange-100/50",
    },
    {
      label: "전기 약 --kWh 사용 시 발생하는 배출량",
      icon: Activity,
      color: "text-indigo-600",
      bg: "bg-indigo-100/50",
    },
  ];

  return (
    <div className="bg-emerald-50 p-8 rounded-[32px] border border-emerald-100">
      <div className="mb-8">
        <h3 className="text-xl font-black mb-2 text-emerald-900">
          이번 활동으로 줄인 {carbonReductionKg != null ? `${carbonReductionKg.toFixed(2)}kg CO₂` : "--kg CO₂"}는
        </h3>
        <p className="text-sm text-emerald-600/70 font-medium">
          일상 속에서 다음과 같은 가치와 비슷합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-emerald-100/50 shadow-sm"
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                item.bg,
                item.color,
              )}
            >
              <item.icon size={24} />
            </div>
            <p className="text-sm font-bold text-slate-700 leading-relaxed pt-1">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
