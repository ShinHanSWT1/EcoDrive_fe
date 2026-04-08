import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import type {
  DrivingLatestCarbon,
  DrivingLatestScore,
  DrivingMonthlySummary,
  DrivingRecentSession,
} from "../driving.api";
import type { ScoreHistoryItem, ScoreTrendItem } from "../driving.types";
import { SafetyScoreCard } from "./SafetyScoreCard";
import { SafetyScoreCriteriaCard } from "./SafetyScoreCriteriaCard";
import { SafetyScoreHistoryCard } from "./SafetyScoreHistoryCard";
import { DailyScoreTrendChart } from "./DailyScoreTrendChart";
import { CarbonReductionSection } from "./CarbonReductionSection";

interface ScoreCarbonSectionProps {
  latestScore: DrivingLatestScore | null;
  latestCarbon: DrivingLatestCarbon | null;
  recentSessions: DrivingRecentSession[];
  monthlySummary: DrivingMonthlySummary | null;
  scoreHistory: ScoreHistoryItem[];
  scoreTrend: ScoreTrendItem[];
}

export function ScoreCarbonSection({
  latestScore,
  latestCarbon,
  recentSessions,
  monthlySummary,
  scoreHistory,
  scoreTrend,
}: ScoreCarbonSectionProps) {
  const recentDistanceKm = recentSessions.reduce(
    (sum, session) => sum + session.distanceKm,
    0,
  );

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
        <SafetyScoreCard
          score={latestScore?.score ?? null}
          snapshotDate={latestScore?.snapshotDate ?? null}
          recentDistanceKm={recentDistanceKm}
          monthlyDistanceKm={monthlySummary?.totalDistanceKm ?? null}
        />
        <SafetyScoreCriteriaCard
          snapshotDate={latestScore?.snapshotDate ?? null}
          monthlyDistanceKm={monthlySummary?.totalDistanceKm ?? null}
          monthLabel={monthlySummary ? `${monthlySummary.month}월` : null}
        />
        <SafetyScoreHistoryCard items={scoreHistory} />
        <DailyScoreTrendChart trendData={scoreTrend} />
        </div>
      </div>

      <div className="h-px bg-slate-100 my-4" />

      <CarbonReductionSection
        carbonReductionKg={latestCarbon?.carbonReductionKg ?? null}
        rewardPoint={latestCarbon?.rewardPoint ?? null}
        monthlySummary={monthlySummary}
      />
    </motion.div>
  );
}
