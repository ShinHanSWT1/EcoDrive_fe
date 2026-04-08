import { Leaf } from "lucide-react";
import { CarbonReductionCard } from "./CarbonReductionCard";
import { CarbonReductionFormulaCard } from "./CarbonReductionFormulaCard";
import { CarbonReductionEquivalenceCard } from "./CarbonReductionEquivalenceCard";

interface CarbonReductionSectionProps {
  carbonReductionKg: number | null;
  rewardPoint: number | null;
}

export function CarbonReductionSection({
  carbonReductionKg,
  rewardPoint,
}: CarbonReductionSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-2">
        <Leaf className="text-emerald-600" size={24} />
        <h3 className="text-2xl font-black text-slate-900">탄소 절감 성과</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CarbonReductionCard
          carbonReductionKg={carbonReductionKg}
          rewardPoint={rewardPoint}
        />
        <div className="lg:col-span-2">
          <CarbonReductionFormulaCard carbonReductionKg={carbonReductionKg} />
        </div>
      </div>

      <CarbonReductionEquivalenceCard carbonReductionKg={carbonReductionKg} />
    </div>
  );
}
