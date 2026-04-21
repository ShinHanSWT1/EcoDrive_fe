import { Leaf } from "lucide-react";
import type { DrivingMonthlySummary } from "../driving.api";
import { CarbonReductionCard } from "./CarbonReductionCard";
import { CarbonReductionEquivalenceCard } from "./CarbonReductionEquivalenceCard";

interface CarbonReductionSectionProps {
 carbonReductionKg: number | null;
 rewardPoint: number | null;
 monthlySummary: DrivingMonthlySummary | null;
}

export function CarbonReductionSection({
 carbonReductionKg,
 rewardPoint,
 monthlySummary,
}: CarbonReductionSectionProps) {
 const monthLabel = monthlySummary ? `${monthlySummary.month}월` : null;

 return (
 <div className="space-y-6">
 <div className="flex items-center gap-2 px-2">
 <Leaf className="text-emerald-600" size={24} />
 <h3 className="text-2xl font-black text-slate-900">탄소 절감 성과</h3>
 </div>

 <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
 <CarbonReductionCard
 carbonReductionKg={carbonReductionKg}
 rewardPoint={rewardPoint}
 monthLabel={monthLabel}
 />
 <div className="lg:col-span-2">
 <CarbonReductionEquivalenceCard carbonReductionKg={carbonReductionKg} />
 </div>
 </div>
 </div>
 );
}
