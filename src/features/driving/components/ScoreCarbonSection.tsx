import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import type {
  DrivingLatestCarbon,
  DrivingLatestScore,
  DrivingMonthlySummary,
  DrivingRecentSession,
} from "../driving.api";
import type { MonthOption, ScoreChangeListItem, ScoreTrendItem } from "../driving.types";
import { SafetyScoreCard } from "./SafetyScoreCard";
import { SafetyScoreCriteriaCard } from "./SafetyScoreCriteriaCard";
import { SafetyScoreHistoryCard } from "./SafetyScoreHistoryCard";
import { DailyScoreTrendChart } from "./DailyScoreTrendChart";
import { CarbonReductionSection } from "./CarbonReductionSection";

function formatKoreanDate(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  if (!year || !month || !day) {
    return dateValue;
  }
  return `${year}년 ${month}월 ${day}일`;
}

interface ScoreCarbonSectionProps {
  latestScore: DrivingLatestScore | null;
  latestCarbon: DrivingLatestCarbon | null;
  recentSessions: DrivingRecentSession[];
  monthlySummary: DrivingMonthlySummary | null;
  scoreTrend: ScoreTrendItem[];
  scoreSectionMonthKey: string;
  scoreSectionMonthOptions: MonthOption[];
  scoreChangeListItems: ScoreChangeListItem[];
  onScoreSectionMonthChange: (monthKey: string) => void;
}

export function ScoreCarbonSection({
  latestScore,
  latestCarbon,
  recentSessions,
  monthlySummary,
  scoreTrend,
  scoreSectionMonthKey,
  scoreSectionMonthOptions,
  scoreChangeListItems,
  onScoreSectionMonthChange,
}: ScoreCarbonSectionProps) {
  const recentDistanceKm = recentSessions.reduce(
    (sum, session) => sum + session.distanceKm,
    0,
  );
  const safetyPeriodLabel =
    monthlySummary && latestScore?.snapshotDate
      ? `${monthlySummary.year}년 ${monthlySummary.month}월 1일 ~ ${formatKoreanDate(
          latestScore.snapshotDate,
        )}`
      : null;

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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SafetyScoreCard
            score={latestScore?.score ?? null}
            snapshotDate={latestScore?.snapshotDate ?? null}
            recentDistanceKm={recentDistanceKm}
            monthlyDistanceKm={monthlySummary?.totalDistanceKm ?? null}
          />
          <SafetyScoreCriteriaCard
            periodLabel={safetyPeriodLabel}
            monthlyDistanceKm={monthlySummary?.totalDistanceKm ?? null}
          />
          <SafetyScoreHistoryCard
            monthOptions={scoreSectionMonthOptions}
            selectedMonthKey={scoreSectionMonthKey}
            items={scoreChangeListItems}
            onMonthChange={onScoreSectionMonthChange}
          />
          <DailyScoreTrendChart
            trendData={scoreTrend}
            currentScore={latestScore?.score ?? null}
            currentScoreDate={latestScore?.snapshotDate ?? null}
          />
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
