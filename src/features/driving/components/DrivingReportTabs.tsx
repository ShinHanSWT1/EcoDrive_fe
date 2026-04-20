import { cn } from "../../../shared/lib/utils";
import type { DrivingTab } from "../driving.types";
import { motion } from "motion/react";

interface DrivingReportTabsProps {
  activeTab: DrivingTab;
  onTabChange: (tab: DrivingTab) => void;
}

export function DrivingReportTabs({
  activeTab,
  onTabChange,
}: DrivingReportTabsProps) {
  return (
    <div className="flex bg-slate-100/80 p-2 rounded-full w-full sm:w-fit mb-4 shadow-inner border-2 border-white backdrop-blur-md">
      <button
        onClick={() => onTabChange("history")}
        className={cn(
          "relative flex-1 sm:flex-none px-6 py-3 rounded-full text-sm font-black transition-all whitespace-nowrap overflow-hidden",
          activeTab === "history"
            ? "text-slate-900 shadow-md transform scale-100"
            : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50",
        )}
      >
        {activeTab === "history" && (
          <motion.div
            layoutId="activeTabDriving"
            className="absolute inset-0 bg-white"
            style={{ borderRadius: 9999 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">나의 주행기록 마법 리포트</span>
      </button>

      <button
        onClick={() => onTabChange("score")}
        className={cn(
          "relative flex-1 sm:flex-none px-6 py-3 rounded-full text-sm font-black transition-all whitespace-nowrap overflow-hidden",
          activeTab === "score"
            ? "text-slate-900 shadow-md transform scale-100"
            : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50",
        )}
      >
        {activeTab === "score" && (
          <motion.div
            layoutId="activeTabDriving"
            className="absolute inset-0 bg-white"
            style={{ borderRadius: 9999 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">안전 점수 & 탄소 캡슐</span>
      </button>
    </div>
  );
}
