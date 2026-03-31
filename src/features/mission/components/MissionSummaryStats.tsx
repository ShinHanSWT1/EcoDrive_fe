import type { MissionSummary } from "../mission.types";

type MissionSummaryStatsProps = {
  summary: MissionSummary;
};

export default function MissionSummaryStats({
  summary,
}: MissionSummaryStatsProps) {
  return (
    <div className="bg-white rounded-[32px] p-5 md:p-6 border border-slate-200 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-3 md:p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase mb-1">
            진행 중 미션
          </div>
          <div className="text-lg md:text-xl font-black text-slate-900">
            {summary.activeMissionCount}건
          </div>
        </div>

        <div className="p-3 md:p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="text-[9px] md:text-[10px] text-blue-400 font-bold uppercase mb-1">
            이번 주 보상
          </div>
          <div className="text-lg md:text-xl font-black text-blue-600">
            {summary.weeklyRewardPoint.toLocaleString("ko-KR")} P
          </div>
        </div>

        <div className="p-3 md:p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase mb-1">
            이달 달성률
          </div>
          <div className="text-lg md:text-xl font-black text-slate-900">
            {summary.monthlyAchievementRate}%
          </div>
        </div>

        <div className="p-3 md:p-4 bg-slate-900 rounded-2xl text-white">
          <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase mb-1">
            안전점수 / 탄소절감
          </div>
          <div className="text-lg md:text-xl font-black">
            {summary.safetyScore} / {summary.carbonReductionKg}kg
          </div>
        </div>
      </div>
    </div>
  );
}
