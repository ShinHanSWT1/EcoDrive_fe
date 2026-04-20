import { AnimatePresence } from "motion/react";
import { useDriving } from "./useDriving";
import {
  getDrivingDailySummaries,
  getDrivingMonthlySummary,
  getDrivingWeeklySummaries,
} from "./driving.api";
import { parseYearMonthKey } from "./driving.mapper";
import { DrivingReportTabs } from "./components/DrivingReportTabs";
import { DrivingHistorySection } from "./components/DrivingHistorySection";
import { ScoreCarbonSection } from "./components/ScoreCarbonSection";
import { Vehicle3DViewer } from "./components/Vehicle3DViewer";
import PageHeader from "../../shared/ui/PageSectionHeader";
import VehicleSelector from "../../shared/ui/VehicleSelector";
import type { MyVehicleResponse } from "../../shared/api/onboarding";
import { reportPdfTheme } from "./reportPdfTheme";

function normalizeDateKey(dateText: string | null | undefined) {
  if (!dateText) {
    return "";
  }
  return dateText.slice(0, 10);
}

function formatWeekRange(startDate: string | null, endDate: string | null) {
  if (!startDate || !endDate) {
    return "기간 정보 없음";
  }

  const start = startDate.slice(5).replace("-", ".");
  const end = endDate.slice(5).replace("-", ".");
  return `${start} ~ ${end}`;
}

export default function DrivingReport({
  vehicles,
  selectedUserVehicleId,
  onVehicleChange,
}: {
  vehicles: MyVehicleResponse[];
  selectedUserVehicleId: number | null;
  onVehicleChange: (userVehicleId: number | null) => void;
}) {
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
    selectedMonthKey,
    setSelectedMonthKey,
    availableMonthOptions,
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
    scoreTrend,
    scoreSectionMonthKey,
    scoreSectionMonthOptions,
    scoreChangeListItems,
    setScoreSectionMonthKey,
    isLoading,
    isRefreshing,
    isGeneratingDummyData,
    isError,
    refresh,
    addDummyDrivingData,
  } = useDriving(selectedUserVehicleId);

  const selectedVehicleLabel =
    selectedUserVehicleId == null
      ? "전체 차량 (통합)"
      : (() => {
          const selectedVehicle = vehicles.find(
            (vehicle) => vehicle.userVehicleId === selectedUserVehicleId,
          );
          if (!selectedVehicle) {
            return "선택 차량";
          }
          return `${selectedVehicle.manufacturer} ${selectedVehicle.modelName} · ${selectedVehicle.vehicleNumber}`;
        })();

  const selectedMonthLabel =
    availableMonthOptions.find((option) => option.key === selectedMonthKey)?.label ??
    selectedMonthKey;

  const handleWeekChange = (weekKey: string) => {
    setSelectedWeekKey(weekKey);

    const selectedWeek = weeklySummaries.find((item) => item.weekKey === weekKey);
    if (!selectedWeek || !selectedWeek.startDate || !selectedWeek.endDate) {
      return;
    }

    // 주차 선택 시 실제 일간 데이터도 해당 주차 범위로 동기화한다.
    const inRangeDateKeys = availableDateKeys.filter(
      (dateKey) => selectedWeek.startDate! <= dateKey && dateKey <= selectedWeek.endDate!,
    );
    const nextDateKey =
      inRangeDateKeys.length > 0
        ? inRangeDateKeys[inRangeDateKeys.length - 1]
        : normalizeDateKey(selectedWeek.endDate);

    if (nextDateKey && nextDateKey !== selectedDate) {
      setSelectedDate(nextDateKey);
    }
  };

  const handleExportMonthlyPdf = () => {
    if (!monthlySummary) {
      alert("월간 요약 데이터가 없어 PDF를 생성할 수 없습니다.");
      return;
    }

    void (async () => {
      try {
        const { year, month } = parseYearMonthKey(selectedMonthKey);
        const [integratedMonthlySummary, integratedWeeklySummaries, weeklyByVehicle] =
          await Promise.all([
            getDrivingMonthlySummary(year, month, null),
            getDrivingWeeklySummaries(year, month, null),
            Promise.all(
              vehicles.map(async (vehicle) => ({
                vehicle,
                weeklySummaries: await getDrivingWeeklySummaries(
                  year,
                  month,
                  vehicle.userVehicleId,
                ),
              })),
            ),
          ]);
        const integratedDailySummaries = await getDrivingDailySummaries(year, month, null);
        const dailySummaryByDate = new Map(
          integratedDailySummaries.map((summary) => [normalizeDateKey(summary.sessionDate), summary]),
        );

        const { default: html2pdf } = await import("html2pdf.js");
        const container = document.createElement("div");
        container.style.padding = reportPdfTheme.pagePadding;
        container.style.fontFamily = reportPdfTheme.fontFamily;
        container.style.color = reportPdfTheme.textColor;

        const integratedWeeklyRows = integratedWeeklySummaries
          .map(
            (summary) => `
            <tr>
              <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor};">${summary.label} (${formatWeekRange(summary.startDate, summary.endDate)})</td>
              <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor}; text-align:center;">${summary.totalDistanceKm?.toFixed(reportPdfTheme.numberPrecision) ?? "0.00"}km</td>
              <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor}; text-align:center;">${summary.averageSpeed?.toFixed(reportPdfTheme.numberPrecision) ?? "0.00"}km/h</td>
              <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor}; text-align:center;">${summary.averageIdlingTimeMinutes?.toFixed(0) ?? "0"}분</td>
            </tr>
          `,
          )
          .join("");

        const integratedDailyRowsByWeek = integratedWeeklySummaries
          .map((weekSummary) => {
            if (!weekSummary.startDate || !weekSummary.endDate) {
              return "";
            }

            const weekRows = integratedDailySummaries
              .filter((summary) => {
                const dateKey = normalizeDateKey(summary.sessionDate);
                const startDate = normalizeDateKey(weekSummary.startDate);
                const endDate = normalizeDateKey(weekSummary.endDate);
                return startDate <= dateKey && dateKey <= endDate;
              })
              .flatMap((summary) => {
                const dateKey = normalizeDateKey(summary.sessionDate);
                const sessionCount = Number(summary?.sessionCount ?? 0);
                const totalDistanceKm = Number(summary?.totalDistanceKm ?? 0);
                // 일간 표는 주행이 실제로 있었던 날을 기준으로만 노출한다.
                const hasDrivingData = sessionCount > 0 || totalDistanceKm > 0;

                if (!hasDrivingData) {
                  return [];
                }

                const distance = totalDistanceKm;
                const drivingMinutes = Number(summary?.totalDrivingTimeMinutes ?? 0);
                const idlingMinutes = Number(summary?.totalIdlingTimeMinutes ?? 0);
                const averageSpeed = Number(summary?.averageSpeed ?? 0);
                const maxSpeed = Number(summary?.maxSpeed ?? 0);
                const accel = Number(summary?.rapidAccelCount ?? 0);
                const brake = Number(summary?.hardBrakeCount ?? 0);
                const overspeed = Number(summary?.overspeedCount ?? 0);

                return [`
                  <tr>
                    <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor};">${dateKey}</td>
                    <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor}; text-align:center;">${distance.toFixed(reportPdfTheme.numberPrecision)}km</td>
                    <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor}; text-align:center;">${drivingMinutes}분</td>
                    <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor}; text-align:center;">${idlingMinutes}분</td>
                    <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor}; text-align:center;">${averageSpeed.toFixed(reportPdfTheme.numberPrecision)}km/h</td>
                    <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor}; text-align:center;">${maxSpeed.toFixed(reportPdfTheme.numberPrecision)}km/h</td>
                    <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor}; text-align:center;">${accel}회</td>
                    <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor}; text-align:center;">${brake}회</td>
                    <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor}; text-align:center;">${overspeed}회</td>
                  </tr>
                `];
              })
              .join("");

            if (!weekRows) {
              return "";
            }

            return `
              <h3 style="font-size:14px; margin:18px 0 8px;">${weekSummary.label} (${formatWeekRange(weekSummary.startDate, weekSummary.endDate)})</h3>
              <table style="width:100%; border-collapse:collapse; margin-top:8px; font-size:${reportPdfTheme.tableFontSize};">
                <thead>
                  <tr style="background:${reportPdfTheme.primaryColor}; color:white;">
                    <th style="padding:12px; text-align:left; border-radius:4px 0 0 0;">일자</th>
                    <th style="padding:12px;">주행거리</th>
                    <th style="padding:12px;">주행시간</th>
                    <th style="padding:12px;">공회전</th>
                    <th style="padding:12px;">평균속도</th>
                    <th style="padding:12px;">최고속도</th>
                    <th style="padding:12px;">급가속</th>
                    <th style="padding:12px;">급감속</th>
                    <th style="padding:12px; border-radius:0 4px 0 0;">과속</th>
                  </tr>
                </thead>
                <tbody>
                  ${weekRows}
                </tbody>
              </table>
            `;
          })
          .join("");

        const vehicleSections = weeklyByVehicle
          .map(({ vehicle, weeklySummaries }) => {
            const rows = weeklySummaries
              .map(
                (summary) => `
                <tr>
                  <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor};">${summary.label} (${formatWeekRange(summary.startDate, summary.endDate)})</td>
                  <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor}; text-align:center;">${summary.totalDistanceKm?.toFixed(reportPdfTheme.numberPrecision) ?? "0.00"}km</td>
                  <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor}; text-align:center;">${summary.averageDistanceKm?.toFixed(reportPdfTheme.numberPrecision) ?? "0.00"}km</td>
                  <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor}; text-align:center;">${summary.averageSpeed?.toFixed(reportPdfTheme.numberPrecision) ?? "0.00"}km/h</td>
                  <td style="padding:10px; border-bottom:1px solid ${reportPdfTheme.borderColor}; text-align:center;">${summary.averageIdlingTimeMinutes?.toFixed(0) ?? "0"}분</td>
                </tr>
              `,
              )
              .join("");

            return `
              <h3 style="font-size:14px; margin:18px 0 8px;">차량별 주차 데이터 - ${vehicle.manufacturer} ${vehicle.modelName} (${vehicle.vehicleNumber})</h3>
              <table style="width:100%; border-collapse:collapse; margin-top:8px; font-size:${reportPdfTheme.tableFontSize};">
                <thead>
                  <tr style="background:${reportPdfTheme.primaryColor}; color:white;">
                    <th style="padding:12px; text-align:left; border-radius:4px 0 0 0;">주차</th>
                    <th style="padding:12px;">총 주행거리</th>
                    <th style="padding:12px;">평균 주행거리</th>
                    <th style="padding:12px;">평균 속도</th>
                    <th style="padding:12px; border-radius:0 4px 0 0;">평균 공회전</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows || "<tr><td colspan='5' style='border-bottom:1px solid #e2e8f0; padding:10px;'>데이터 없음</td></tr>"}
                </tbody>
              </table>
            `;
          })
          .join("");

        const estimatedEmissionKg =
          integratedMonthlySummary.totalDistanceKm *
          reportPdfTheme.estimatedEmissionFactorKgPerKm;
        const reducedEmissionKg = integratedMonthlySummary.carbonReductionKg;
        const netEstimatedEmissionKg = Math.max(estimatedEmissionKg - reducedEmissionKg, 0);
        const reductionRate =
          estimatedEmissionKg <= 0
            ? 0
            : (reducedEmissionKg / estimatedEmissionKg) * 100;
        const reductionPerKmGram =
          integratedMonthlySummary.totalDistanceKm <= 0
            ? 0
            : (reducedEmissionKg * 1000) / integratedMonthlySummary.totalDistanceKm;

        function renderCard(title: string, value: string, color: string) {
          return `
            <div style="border:1px solid ${reportPdfTheme.borderColor}; padding:15px; border-radius:12px; background:white; box-shadow:0 2px 4px rgba(0,0,0,0.02);">
              <div style="font-size:11px; color:${reportPdfTheme.mutedTextColor}; margin-bottom:8px;">${title}</div>
              <div style="font-size:18px; font-weight:800; color:${color};">${value}</div>
            </div>
          `;
        }

        container.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:3px solid ${reportPdfTheme.primaryColor}; padding-bottom:20px; margin-bottom:30px;">
            <div>
              <h1 style="font-size:${reportPdfTheme.titleSize}; color:${reportPdfTheme.primaryColor}; margin:0;">MONTHLY DRIVING REPORT</h1>
              <p style="font-size:16px; font-weight:700; margin:4px 0 0;">${selectedMonthLabel} 주행 분석 및 탄소 발자국 리포트</p>
            </div>
            <div style="text-align:right; font-size:11px; color:${reportPdfTheme.mutedTextColor};">
              <p style="margin:0;">리포트 ID: ECO-${new Date().getTime()}</p>
              <p style="margin:0;">발행일: ${new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div style="background:${reportPdfTheme.headerBgColor}; padding:15px; border-radius:8px; margin-bottom:30px; display:flex; gap:40px;">
            <div><span style="color:${reportPdfTheme.mutedTextColor}; font-size:11px;">대상 차량</span><br/><strong>${selectedVehicleLabel}</strong></div>
            <div><span style="color:${reportPdfTheme.mutedTextColor}; font-size:11px;">분석 기간</span><br/><strong>${selectedMonthLabel} 전체</strong></div>
          </div>

          <h2 style="font-size:${reportPdfTheme.sectionTitleSize}; border-left:4px solid ${reportPdfTheme.primaryColor}; padding-left:10px; margin-bottom:15px;">01. 월간 주행 성능 요약</h2>
          <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:15px; margin-bottom:35px;">
            ${renderCard("총 주행거리", `${integratedMonthlySummary.totalDistanceKm.toFixed(1)}km`, reportPdfTheme.primaryColor)}
            ${renderCard("총 주행 세션", `${integratedMonthlySummary.sessionCount}회`, reportPdfTheme.primaryColor)}
            ${renderCard("평균 속도", `${integratedMonthlySummary.averageSpeed?.toFixed(1) ?? "0.0"}km/h`, reportPdfTheme.primaryColor)}
            ${renderCard("공회전 시간", `${integratedMonthlySummary.totalIdlingTimeMinutes}분`, reportPdfTheme.primaryColor)}
          </div>

          <h2 style="font-size:${reportPdfTheme.sectionTitleSize}; border-left:4px solid ${reportPdfTheme.successColor}; padding-left:10px; margin-bottom:15px;">02. 탄소 저감 및 ESG 성과</h2>
          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:15px; margin-bottom:10px;">
            ${renderCard("탄소 절감량", `${reducedEmissionKg.toFixed(2)}kgCO2e`, reportPdfTheme.successColor)}
            ${renderCard("절감률", `${reductionRate.toFixed(1)}%`, reportPdfTheme.successColor)}
            ${renderCard("적립 포인트", `${integratedMonthlySummary.rewardPoint.toLocaleString("ko-KR")}P`, reportPdfTheme.successColor)}
          </div>
          <p style="font-size:10px; color:${reportPdfTheme.mutedTextColor}; margin-bottom:35px;">* 주행 후 순배출 추정량: ${netEstimatedEmissionKg.toFixed(2)}kgCO2e (거리 기반 산출)</p>

          <h2 style="font-size:${reportPdfTheme.sectionTitleSize}; border-left:4px solid ${reportPdfTheme.primaryColor}; padding-left:10px; margin-bottom:15px;">03. 주차별 데이터</h2>
          <table style="width:100%; border-collapse:collapse; font-size:${reportPdfTheme.tableFontSize}; margin-bottom:24px;">
            <thead>
              <tr style="background:${reportPdfTheme.primaryColor}; color:white;">
                <th style="padding:12px; text-align:left; border-radius:4px 0 0 0;">주차</th>
                <th style="padding:12px;">주행거리</th>
                <th style="padding:12px;">평균 속도</th>
                <th style="padding:12px; border-radius:0 4px 0 0;">공회전</th>
              </tr>
            </thead>
            <tbody>
              ${integratedWeeklyRows || "<tr><td colspan='4' style='border-bottom:1px solid #e2e8f0; padding:10px;'>데이터 없음</td></tr>"}
            </tbody>
          </table>

          <h2 style="font-size:${reportPdfTheme.sectionTitleSize}; border-left:4px solid ${reportPdfTheme.primaryColor}; padding-left:10px; margin:24px 0 8px;">04. 통합 주차별 일간 주행 데이터</h2>

          ${integratedDailyRowsByWeek || "<p style='font-size:12px; color:#64748b;'>표시할 일간 주행 데이터가 없습니다.</p>"}

          <h2 style="font-size:${reportPdfTheme.sectionTitleSize}; border-left:4px solid ${reportPdfTheme.primaryColor}; padding-left:10px; margin:24px 0 8px;">05. 차량별 주차 데이터</h2>
          ${vehicleSections}
        `;

        await html2pdf()
          .from(container)
          .set({
            margin: [10, 10, 10, 10],
            filename: `ecodrive-report-${year}-${String(month).padStart(2, "0")}.pdf`,
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          })
          .save();
      } catch (error) {
        console.error("월간 PDF 내보내기 실패:", error);
        alert("PDF 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
    })();
  };

  return (
    <div className="space-y-6 pb-12">
      <section className="flex flex-col gap-4">
        <PageHeader
          title="주행 분석 리포트"
          description="데이터로 분석한 나의 운전 습관과 환경 기여도입니다."
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3">
            <DrivingReportTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <VehicleSelector
              vehicles={vehicles}
              selectedUserVehicleId={selectedUserVehicleId}
              onChange={onVehicleChange}
              label="리포트 기준 차량"
              disabled={isLoading || isRefreshing || isGeneratingDummyData}
              includeIntegratedOption
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {showDevDummyButton && selectedUserVehicleId !== null ? (
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
            <button
              type="button"
              onClick={handleExportMonthlyPdf}
              disabled={isLoading || isRefreshing || isGeneratingDummyData}
              aria-label="월간 PDF 내보내기"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              <img
                src="/media/download_icon.png"
                alt="PDF 다운로드"
                className="h-5 w-5 object-contain"
              />
            </button>
          </div>
        </div>
      </section>

      {(() => {
        const selVehicle = vehicles.find((v) => v.userVehicleId === selectedUserVehicleId);
        const isAvante = selVehicle?.modelName?.includes("아반떼") || selVehicle?.modelName?.toUpperCase().includes("AVANTE");
        return isAvante ? <Vehicle3DViewer /> : null;
      })()}

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
              availableMonthOptions={availableMonthOptions}
              selectedMonthKey={selectedMonthKey}
              selectedWeekKey={selectedWeekKey}
              weeklySummaries={weeklySummaries}
              selectedWeeklySummary={selectedWeeklySummary}
              monthlyHistory={monthlyHistory}
              monthlySummaryData={monthlySummaryData}
              onDateChange={setSelectedDate}
              onGoToToday={goToToday}
              onMonthChange={setSelectedMonthKey}
              onWeekChange={handleWeekChange}
              isTodaySelected={selectedDate === todayKey}
            />
          ) : (
            <ScoreCarbonSection
              key="score"
              latestScore={latestScore}
              latestCarbon={latestCarbon}
              recentSessions={recentSessions}
              monthlySummary={monthlySummary}
              scoreTrend={scoreTrend}
              scoreSectionMonthKey={scoreSectionMonthKey}
              scoreSectionMonthOptions={scoreSectionMonthOptions}
              scoreChangeListItems={scoreChangeListItems}
              onScoreSectionMonthChange={setScoreSectionMonthKey}
            />
          )}
        </AnimatePresence>
      ) : null}
    </div>
  );
}
