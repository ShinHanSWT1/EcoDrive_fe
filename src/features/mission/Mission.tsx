import PageHeader from "../../shared/ui/PageSectionHeader";
import { useMission } from "./useMission";
import MissionSummaryStats from "./components/MissionSummaryStats";
import MissionListSection from "./components/MissionListSection";
import MissionRewardPanel from "./components/MissionRewardPanel";
import MissionGuideCard from "./components/MissionGuideCard";

export default function Mission() {
 const { data, isLoading, isError } = useMission();

 if (isLoading) {
 return (
 <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500">
 미션 정보를 불러오는 중입니다.
 </div>
 );
 }

 if (isError || !data) {
 return (
 <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-600">
 미션 정보를 불러오지 못했습니다.
 </div>
 );
 }

 return (
 <div className="space-y-8 max-w-5xl mx-auto pb-12">
 <PageHeader
 title="운전 습관 개선 미션"
 description="매일 주행 습관을 개선하고 포인트를 적립해보세요."
 />

 <MissionSummaryStats summary={data.summary} />

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <MissionListSection missions={data.missions} />

 <div className="space-y-6">
 <MissionRewardPanel rewards={data.monthlyRewards} />
 <MissionGuideCard guide={data.guide} />
 </div>
 </div>
 </div>
 );
}
