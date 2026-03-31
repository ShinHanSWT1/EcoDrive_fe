import { AnimatePresence } from "motion/react";
import { useDriving } from "./useDriving";
import { DrivingReportTabs } from "./components/DrivingReportTabs";
import { DrivingHistorySection } from "./components/DrivingHistorySection";
import { ScoreCarbonSection } from "./components/ScoreCarbonSection";
import PageHeader from "../../shared/ui/PageSectionHeader";

export default function DrivingReport() {
  const { activeTab, setActiveTab, selectedDay, setSelectedDay } = useDriving();

  return (
    <div className="space-y-6 pb-12">
      <section className="flex flex-col gap-4">
        <PageHeader
          title="주행 분석 리포트"
          description="데이터로 분석한 나의 운전 습관과 환경 기여도입니다."
        />
        <DrivingReportTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </section>

      <AnimatePresence mode="wait">
        {activeTab === "history" ? (
          <DrivingHistorySection
            key="history"
            selectedDay={selectedDay}
            onDayChange={setSelectedDay}
          />
        ) : (
          <ScoreCarbonSection key="score" />
        )}
      </AnimatePresence>
    </div>
  );
}
