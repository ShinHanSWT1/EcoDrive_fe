import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { SafetyScoreCard } from "./SafetyScoreCard";
import { SafetyScoreCriteriaCard } from "./SafetyScoreCriteriaCard";
import { SafetyScoreHistoryCard } from "./SafetyScoreHistoryCard";
import { DailyScoreTrendChart } from "./DailyScoreTrendChart";
import { CarbonReductionSection } from "./CarbonReductionSection";

export function ScoreCarbonSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <ShieldCheck className="text-blue-600" size={24} />
          <h3 className="text-2xl font-black text-slate-900">안전 점수</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SafetyScoreCard />
        <SafetyScoreCriteriaCard />
        <SafetyScoreHistoryCard />
        <DailyScoreTrendChart />
        </div>
      </div>

      <div className="h-px bg-slate-100 my-4" />

      <CarbonReductionSection />
    </motion.div>
  );
}
