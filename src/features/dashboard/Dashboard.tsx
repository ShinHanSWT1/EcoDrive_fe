import PageHeader from "../../shared/ui/PageSectionHeader";
import { useDashboard } from "./useDashboard";
import DashboardOverview from "./components/DashboardOverview";
import SavingsChartCard from "./components/SavingsChartCard";
import WalletWidget from "./components/WalletWidget";
import DrivingSummaryWidget from "./components/DrivingSummaryWidget";
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
 <div className="flex flex-col items-start space-y-10 lg:space-y-14 pb-24 relative z-10 font-sans mt-4 px-4 md:px-12 w-full max-w-[1400px] mx-auto">
 <div className="w-full">
 <PageHeader
 title="대시보드"
 />
 </div>

 <div className="w-full">
 <DashboardOverview 
 stats={data.stats.filter(s => s.id !== "score")} 
 pointBalance={data.pointBalance}
 todayEarnedPoints={data.todayEarnedPoints}
 />
 </div>

 <div className="flex flex-col gap-6 w-full">
 <div className="w-full">
 <SavingsChartCard chartData={data.savingsChart} />
 </div>

 <div className="w-full">
 <DrivingSummaryWidget
 summaryNote={data.summaryNote}
 todayDrivingSummary={data.todayDrivingSummary}
 metrics={data.todayMetrics}
 />
 </div>
 </div>

 <div className="w-full">
 <InsuranceDiscountPreview items={data.insurancePreviews} />
 </div>
 </div>
 );
}
