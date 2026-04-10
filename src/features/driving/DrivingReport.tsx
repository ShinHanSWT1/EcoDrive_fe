import { AnimatePresence } from "motion/react";
import { useDriving } from "./useDriving";
import { DrivingReportTabs } from "./components/DrivingReportTabs";
import { DrivingHistorySection } from "./components/DrivingHistorySection";
import { ScoreCarbonSection } from "./components/ScoreCarbonSection";
import PageHeader from "../../shared/ui/PageSectionHeader";

export default function DrivingReport() {
  const showDevDummyButton =
    import.meta.env.DEV || import.meta.env.VITE_SHOW_DUMMY_BUTTON === "true";
  const {
    activeTab,
    setActiveTab,
    selectedDate,
    setSelectedDate,
    selectedDailyData,
    goToToday,
    todayKey,
    availableDateKeys,
    selectedWeekKey,
    setSelectedWeekKey,
    latestScore,
    latestCarbon,
    recentSessions,
    weeklySummaries,
    selectedWeeklySummary,
    monthlyHistory,
    monthlySummaryData,
    monthlySummary,
    scoreHistory,
    scoreTrend,
    isLoading,
    isRefreshing,
    isGeneratingDummyData,
    isError,
    refresh,
    addDummyDrivingData,
  } = useDriving();

  return (
    <div className="space-y-6 pb-12">
      <section className="flex flex-col gap-4">
        <PageHeader
          title="주행 분석 리포트"
          description="데이터로 분석한 나의 운전 습관과 환경 기여도입니다."
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <DrivingReportTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {showDevDummyButton ? (
              <button
                type="button"
                onClick={() => void addDummyDrivingData()}
                disabled={isLoading || isRefreshing || isGeneratingDummyData}
                className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400"
              >
                {isGeneratingDummyData ? "더미 주행 추가 중..." : "테스트용 더미 주행 추가"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={isLoading || isRefreshing || isGeneratingDummyData}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {isRefreshing ? "새로고침 중..." : "리포트 새로고침"}
            </button>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500">
          주행 데이터를 불러오는 중입니다.
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-600">
          주행 데이터를 불러오지 못했습니다.
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <AnimatePresence mode="wait">
          {activeTab === "history" ? (
            <DrivingHistorySection
              key="history"
              selectedDate={selectedDate}
              selectedDailyData={selectedDailyData}
              minDate={availableDateKeys[0]}
              maxDate={todayKey}
              selectedWeekKey={selectedWeekKey}
              weeklySummaries={weeklySummaries}
              selectedWeeklySummary={selectedWeeklySummary}
              monthlyHistory={monthlyHistory}
              monthlySummaryData={monthlySummaryData}
              onDateChange={setSelectedDate}
              onGoToToday={goToToday}
              onWeekChange={setSelectedWeekKey}
              isTodaySelected={selectedDate === todayKey}
            />
          ) : (
            <ScoreCarbonSection
              key="score"
              latestScore={latestScore}
              latestCarbon={latestCarbon}
              recentSessions={recentSessions}
              monthlySummary={monthlySummary}
              scoreHistory={scoreHistory}
              scoreTrend={scoreTrend}
            />
          )}
        </AnimatePresence>
      ) : null}
    </div>
  );
}
