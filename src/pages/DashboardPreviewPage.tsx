import PageHeader from "../shared/ui/PageSectionHeader";
import DashboardOverview from "../features/dashboard/components/DashboardOverview";
import SavingsChartCard from "../features/dashboard/components/SavingsChartCard";
import DashboardSidePanel from "../features/dashboard/components/DashboardSidePanel";
import InsuranceDiscountPreview from "../features/dashboard/components/InsuranceDiscountPreview";
import { dashboardMockData } from "../features/dashboard/dashboard.mock";

export default function DashboardPreviewPage() {
  const data = dashboardMockData;

  return (
    <div className="space-y-6">
      <PageHeader
        title="서비스 미리보기"
        description="로그인 없이 더미 데이터로 대시보드 화면을 둘러볼 수 있습니다."
      />

      <DashboardOverview stats={data.stats} pointBalance={data.pointBalance} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SavingsChartCard chartData={data.savingsChart} />
        <DashboardSidePanel
          pointBalance={data.pointBalance}
          todayEarnedPoints={data.todayEarnedPoints}
          summaryNote={data.summaryNote}
          todayDrivingSummary={data.todayDrivingSummary}
        />
      </div>

      <InsuranceDiscountPreview items={data.insurancePreviews} />
    </div>
  );
}
