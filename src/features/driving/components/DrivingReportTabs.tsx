import { cn } from "../../../shared/lib/utils";
import type { DrivingTab } from "../driving.types";

interface DrivingReportTabsProps {
  activeTab: DrivingTab;
  onTabChange: (tab: DrivingTab) => void;
}

export function DrivingReportTabs({
  activeTab,
  onTabChange,
}: DrivingReportTabsProps) {
  return (
    <div className="flex bg-slate-100 p-1 rounded-2xl w-full sm:w-fit mb-8">
      <button
        onClick={() => onTabChange("history")}
        className={cn(
          "flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
          activeTab === "history"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-700",
        )}
      >
        나의 주행기록 리포트
      </button>
      <button
        onClick={() => onTabChange("score")}
        className={cn(
          "flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
          activeTab === "score"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-700",
        )}
      >
        안전 점수 / 탄소 절감
      </button>
    </div>
  );
}
