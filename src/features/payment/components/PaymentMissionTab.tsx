import { Calendar, Clock, Zap } from "lucide-react";
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
  items,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badgeClass: string;
  progressClass: string;
  items: MissionItem[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h4 className="font-bold text-slate-900 flex items-center gap-2">
          {icon} {title}
        </h4>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {subtitle}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((mission) => (
          <div
            key={mission.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md w-fit mb-2",
                    badgeClass,
                  )}
                >
                  {title}
                </div>
                <h5 className="font-bold text-slate-800">{mission.title}</h5>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-bold uppercase">
                  보상
                </div>
                <div className="text-sm font-black text-blue-600">
                  {mission.rewardPoint.toLocaleString("ko-KR")} P
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-500">
                  현재 {mission.current} / 목표 {mission.target}
                </span>
                <span
                  className={
                    mission.progress >= 100
                      ? "text-emerald-600"
                      : "text-blue-600"
                  }
                >
                  {mission.progress >= 100 ? "달성!" : `${mission.progress}%`}
                </span>
              </div>

              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    mission.progress >= 100 ? "bg-emerald-500" : progressClass,
                  )}
                  style={{ width: `${Math.min(mission.progress, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
              {mission.progress >= 100 ? (
                <span className="text-emerald-600">보상 지급 예정</span>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
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
  const weeklyMissions = missions.filter(
    (mission) => mission.type === "weekly",
  );
  const monthlyMissions = missions.filter(
    (mission) => mission.type === "monthly",
  );

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900">
              Pay 포인트 적립 미션
            </h3>
            <p className="text-sm text-slate-500">
              다양한 활동을 통해 포인트를 적립하고 결제 시 사용하세요.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 max-w-2xl">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                진행 중 미션
              </div>
              <div className="text-lg font-black text-slate-900">
                {summary.activeMissionCount}건
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <div className="text-[10px] text-blue-400 font-bold uppercase mb-1">
                이번 주 보상
              </div>
              <div className="text-lg font-black text-blue-600">
                {summary.weeklyRewardPoint.toLocaleString("ko-KR")} P
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                이달 달성률
              </div>
              <div className="text-lg font-black text-slate-900">
                {summary.monthlyAchievementRate}%
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl text-white">
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                안전 점수 / 탄소 절감
              </div>
              <div className="text-lg font-black">
                {summary.safetyScore} / {summary.carbonReductionKg}kg
              </div>
            </div>
          </div>
        </div>
      </div>

      <MissionGroupSection
        title="오늘의 미션"
        subtitle="Daily Missions"
        icon={<Clock size={18} className="text-blue-600" />}
        badgeClass="text-blue-600 bg-blue-50"
        progressClass="bg-blue-600"
        items={dailyMissions}
      />

      <MissionGroupSection
        title="주간 미션"
        subtitle="Weekly Goals"
        icon={<Calendar size={18} className="text-indigo-600" />}
        badgeClass="text-indigo-600 bg-indigo-50"
        progressClass="bg-indigo-500"
        items={weeklyMissions}
      />

      <MissionGroupSection
        title="월간 미션"
        subtitle="Monthly Challenges"
        icon={<Zap size={18} className="text-orange-600" />}
        badgeClass="text-orange-600 bg-orange-50"
        progressClass="bg-orange-500"
        items={monthlyMissions}
      />
    </div>
  );
}
