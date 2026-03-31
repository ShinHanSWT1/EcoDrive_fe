import { motion } from "motion/react";
import type { DrivingDay } from "../driving.types";
import { MonthlyDrivingCard } from "./MonthlyDrivingCard";
import { RecentDrivingRecordSection } from "./RecentDrivingRecordSection";

interface DrivingHistorySectionProps {
  selectedDay: DrivingDay;
  onDayChange: (day: DrivingDay) => void;
}

export function DrivingHistorySection({
  selectedDay,
  onDayChange,
}: DrivingHistorySectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <MonthlyDrivingCard />
      <RecentDrivingRecordSection
        selectedDay={selectedDay}
        onDayChange={onDayChange}
      />
    </motion.div>
  );
}
