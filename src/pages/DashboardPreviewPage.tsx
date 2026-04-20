import PageHeader from "../shared/ui/PageSectionHeader";
import DashboardOverview from "../features/dashboard/components/DashboardOverview";
import SavingsChartCard from "../features/dashboard/components/SavingsChartCard";
import WalletWidget from "../features/dashboard/components/WalletWidget";
import DrivingSummaryWidget from "../features/dashboard/components/DrivingSummaryWidget";
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

 <div className="flex flex-col gap-6">
 <div className="flex flex-wrap lg:flex-nowrap gap-6 items-stretch">
 <div className="flex-1 min-w-0 max-w-[800px]">
 <SavingsChartCard chartData={data.savingsChart} />
 </div>
 <div className="w-full lg:w-[400px] flex-shrink-0">
 <WalletWidget
 pointBalance={data.pointBalance}
 todayEarnedPoints={data.todayEarnedPoints}
 />
 </div>
 </div>
 
 <div className="w-full max-w-[1224px]">
 <DrivingSummaryWidget
 summaryNote={data.summaryNote}
 todayDrivingSummary={data.todayDrivingSummary}
 />
 </div>
 </div>

 <InsuranceDiscountPreview items={data.insurancePreviews} />
 </div>
 );
}
