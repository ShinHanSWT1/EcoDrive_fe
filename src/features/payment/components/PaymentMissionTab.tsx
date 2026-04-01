import { Calendar, Clock, ShieldCheck, Zap } from "lucide-react";
import type { MissionItem, MissionSummary } from "../../mission/mission.types";
import { cn } from "../../../shared/lib/utils";

type PaymentMissionTabProps = {
  summary: MissionSummary;
  missions: MissionItem[];
};

function MissionGroupSection({
  title,
  subtitle,
  icon,
  badgeClass,
  progressClass,
  pulseClass,
  items,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badgeClass: string;
  progressClass: string;
  pulseClass: string;
  items: MissionItem[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
          {icon} {title}
        </h4>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {subtitle}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((mission) => (
          <div
            key={mission.id}
            className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col gap-6 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <div
                  className={cn(
                    "text-[10px] font-black px-3 py-1 rounded-xl w-fit mb-3 tracking-widest uppercase",
                    badgeClass,
                  )}
                >
                  {title}
                </div>
                <h5 className="text-lg font-black text-slate-900">{mission.title}</h5>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                  보상
                </div>
                <div className="text-lg font-black text-blue-600">
                  {mission.rewardPoint.toLocaleString("ko-KR")} P
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-black">
                <span className="text-slate-500">
                  현재 {mission.current} / 목표 {mission.target}
                </span>
                <span
                  className={
                    mission.progress >= 100 ? "text-emerald-600" : "text-blue-600"
                  }
                >
                  {mission.progress >= 100 ? "달성!" : `${mission.progress}%`}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    mission.progress >= 100 ? "bg-emerald-500" : progressClass,
                  )}
                  style={{ width: `${Math.min(mission.progress, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {mission.progress >= 100 ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <ShieldCheck size={14} /> 보상 지급 예정
                </span>
              ) : (
                <>
                  <div className={cn("w-2 h-2 rounded-full animate-pulse", pulseClass)} />
                  자동 반영 중
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PaymentMissionTab({
  summary,
  missions,
}: PaymentMissionTabProps) {
  const dailyMissions = missions.filter((mission) => mission.type === "daily");
  const weeklyMissions = missions.filter((mission) => mission.type === "weekly");

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              Pay 포인트 적립 미션
            </h3>
            <p className="text-base text-slate-500 font-medium">
              다양한 활동을 통해 포인트를 적립하고 결제 시 사용하세요.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 max-w-2xl">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="text-[10px] text-slate-400 font-black uppercase mb-2 tracking-widest">
                진행 중 미션
              </div>
              <div className="text-2xl font-black text-slate-900">
                {summary.activeMissionCount}건
              </div>
            </div>
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
              <div className="text-[10px] text-blue-400 font-black uppercase mb-2 tracking-widest">
                이번 주 보상
              </div>
              <div className="text-2xl font-black text-blue-600">
                {summary.weeklyRewardPoint.toLocaleString("ko-KR")} P
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="text-[10px] text-slate-400 font-black uppercase mb-2 tracking-widest">
                이달 달성률
              </div>
              <div className="text-2xl font-black text-slate-900">
                {summary.monthlyAchievementRate}%
              </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
              <div className="text-[10px] text-slate-400 font-black uppercase mb-2 tracking-widest">
                안전 / 탄소
              </div>
              <div className="text-xl font-black">
                {summary.safetyScore} / {summary.carbonReductionKg}kg
              </div>
            </div>
          </div>
        </div>
        <Zap
          size={200}
          className="absolute -bottom-20 -left-20 text-slate-50 -rotate-12 pointer-events-none"
        />
      </div>

      <MissionGroupSection
        title="오늘의 미션"
        subtitle="Daily Missions"
        icon={<Clock size={22} className="text-blue-600" />}
        badgeClass="text-blue-600 bg-blue-50"
        progressClass="bg-blue-600"
        pulseClass="bg-blue-400"
        items={dailyMissions}
      />

      <MissionGroupSection
        title="주간 미션"
        subtitle="Weekly Goals"
        icon={<Calendar size={22} className="text-indigo-600" />}
        badgeClass="text-indigo-600 bg-indigo-50"
        progressClass="bg-indigo-500"
        pulseClass="bg-indigo-400"
        items={weeklyMissions}
      />
    </div>
  );
}
