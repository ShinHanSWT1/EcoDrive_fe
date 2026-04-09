import { motion } from "motion/react";
import type { DailyDrivingData, MonthlyHistoryItem, MonthlySummaryData, WeeklySummaryItem } from "../driving.types";
import { MonthlyDrivingCard } from "./MonthlyDrivingCard";
import { RecentDrivingRecordSection } from "./RecentDrivingRecordSection";
import { WeeklyDrivingSummarySection } from "./WeeklyDrivingSummarySection";

interface DrivingHistorySectionProps {
  selectedDate: string;
  selectedDailyData: DailyDrivingData;
  minDate?: string;
  maxDate: string;
  selectedWeekKey: string;
  weeklySummaries: WeeklySummaryItem[];
  selectedWeeklySummary: WeeklySummaryItem | null;
  monthlyHistory: MonthlyHistoryItem[];
  monthlySummaryData: MonthlySummaryData | null;
  onDateChange: (date: string) => void;
  onGoToToday: () => void;
  onWeekChange: (weekKey: string) => void;
  isTodaySelected: boolean;
}

export function DrivingHistorySection({
  selectedDate,
  selectedDailyData,
  minDate,
  maxDate,
  selectedWeekKey,
  weeklySummaries,
  selectedWeeklySummary,
  monthlyHistory,
  monthlySummaryData,
  onDateChange,
  onGoToToday,
  onWeekChange,
  isTodaySelected,
}: DrivingHistorySectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <RecentDrivingRecordSection
        selectedDate={selectedDate}
        selectedDailyData={selectedDailyData}
        minDate={minDate}
        maxDate={maxDate}
        onDateChange={onDateChange}
        onGoToToday={onGoToToday}
        isTodaySelected={isTodaySelected}
      />
      <WeeklyDrivingSummarySection
        weeklySummaries={weeklySummaries}
        selectedWeekKey={selectedWeekKey}
        selectedWeeklySummary={selectedWeeklySummary}
        onWeekChange={onWeekChange}
      />
      <MonthlyDrivingCard
        monthlyHistory={monthlyHistory}
        monthlySummaryData={monthlySummaryData}
      />
    </motion.div>
  );
}
