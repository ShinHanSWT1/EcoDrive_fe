import PageHeader from "../../shared/ui/PageSectionHeader";
import { useDashboard } from "./useDashboard";
import DashboardOverview from "./components/DashboardOverview";
import SavingsChartCard from "./components/SavingsChartCard";
import DashboardSidePanel from "./components/DashboardSidePanel";
import InsuranceDiscountPreview from "./components/InsuranceDiscountPreview";

export default function Dashboard() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500">
        대시보드 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-600">
        대시보드 정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="대시보드"
        description={`현재까지 누적 예상 절감액 ${data.totalSavings.toLocaleString("ko-KR")}원입니다.`}
      />

      <DashboardOverview stats={data.stats} pointBalance={data.pointBalance} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SavingsChartCard chartData={data.savingsChart} />
        <DashboardSidePanel
          pointBalance={data.pointBalance}
          expectedWeeklyPoints={data.expectedWeeklyPoints}
          todayDrivingSummary={data.todayDrivingSummary}
        />
      </div>

      <InsuranceDiscountPreview items={data.insurancePreviews} />
    </div>
  );
}
