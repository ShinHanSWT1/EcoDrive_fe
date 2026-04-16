import { Leaf, ShieldCheck, Target, TrendingUp, Zap } from "lucide-react";
import { cn } from "../../../shared/lib/utils";
import type { MissionItem } from "../mission.types";

type MissionCardProps = {
  key: number;
  mission: MissionItem;
};

function getMissionIcon(iconType: MissionItem["iconType"]) {
  switch (iconType) {
    case "zap":
      return Zap;
    case "leaf":
      return Leaf;
    case "shield":
      return ShieldCheck;
    case "trend":
      return TrendingUp;
    case "target":
      return Target;
    default:
      return Target;
  }
}

export default function MissionCard({ mission }: MissionCardProps) {
  const Icon = getMissionIcon(mission.iconType);
  const isCompleted = mission.status === "completed";
  const isSafeScoreSettlementPending =
    mission.targetType === "SAFE_SCORE_GTE" &&
    mission.type !== "daily" &&
    !isCompleted;

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col gap-4 group hover:border-blue-200 transition-all">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            mission.bgClass,
            mission.colorClass,
          )}
        >
          <Icon size={20} />
        </div>

        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-bold uppercase">
            보상
          </div>
          <div className="text-sm font-black text-blue-600">
            {mission.rewardPoint.toLocaleString("ko-KR")}P
          </div>
        </div>
      </div>

      <div>
        <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
          {mission.type} mission
        </div>
        <h4 className="text-base font-bold text-slate-900 mb-4">
          {mission.title}
        </h4>

        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-500">
              현재 {mission.current} / 목표 {mission.target}
            </span>
            <span
              className={
                isCompleted ? "text-emerald-600" : "text-blue-600"
              }
            >
              {isCompleted ? "달성!" : `${mission.progress}%`}
            </span>
          </div>

          <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "absolute top-0 left-0 h-full transition-all duration-1000 rounded-full",
                isCompleted
                  ? "bg-emerald-500"
                  : mission.colorClass.replace("text", "bg"),
              )}
              style={{ width: `${Math.min(mission.progress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-auto">
        {isCompleted ? (
          <span className="text-emerald-600">보상 지급 예정</span>
        ) : isSafeScoreSettlementPending ? (
          <span className="text-amber-600">평가 대기 (기간 종료 후 확정)</span>
        ) : (
          <>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            자동 반영 중
          </>
        )}
      </div>
    </div>
  );
}
