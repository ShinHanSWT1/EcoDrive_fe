import {api} from "../../shared/api/client";
import type {ApiResponse} from "../../shared/types/api";
import {missionGuide, monthlyRewards,} from "./mission.mock";
import {getLatestDrivingCarbon, getLatestDrivingScore,} from "../driving/driving.api";
import type {
    MissionCategory,
    MissionItem,
    MissionPageData,
    MissionStatus,
    MissionType,
    MissionViewDto,
} from "./mission.types";

// 백엔드 daily 미션 조회 호출
async function getDailyMissions(): Promise<MissionViewDto[]> {
    const response = await api.get<ApiResponse<MissionViewDto[]>>("/missions/daily");
    return response.data.data;
}

// 백엔드 weekly 미션 조회 호출
async function getWeeklyMissions(): Promise<MissionViewDto[]> {
    const response = await api.get<ApiResponse<MissionViewDto[]>>("/missions/weekly");
    return response.data.data;
}

// 백엔드 상태값을 프론트 상태값으로 변환
function mapMissionStatus(status: MissionViewDto["status"]): MissionStatus {
    return status === "COMPLETED" ? "completed" : "in_progress";
}

// 백엔드 타입값을 프론트 타입값으로 변환
function mapMissionType(type: MissionViewDto["missionType"]): MissionType {
    if (type === "WEEKLY") return "weekly";
    if (type === "MONTHLY") return "monthly";
    return "daily";
}

// 카테고리 기반 카드 톤 결정
function mapMissionStyle(category: MissionCategory) {
    if (category === "ECO") {
        return {
            iconType: "leaf" as const,
            colorClass: "text-emerald-500",
            bgClass: "bg-emerald-50",
        };
    }
    if (category === "SAFETY") {
        return {
            iconType: "shield" as const,
            colorClass: "text-blue-500",
            bgClass: "bg-blue-50",
        };
    }
    return {
        iconType: "target" as const,
        colorClass: "text-orange-500",
        bgClass: "bg-orange-50",
    };
}

// 목표 타입 기반 단위 문자열 결정
function getTargetUnit(targetType: MissionViewDto["targetType"]): string {
    switch (targetType) {
        case "DISTANCE_KM_GTE":
            return "km";
        case "SAFE_SCORE_GTE":
            return "점";
        case "HARD_ACCEL_COUNT_LTE":
        case "HARD_BRAKE_COUNT_LTE":
        case "NO_HARD_EVENT_DAYS_GTE":
            return "회";
        case "IDLING_MINUTES_LTE":
            return "분";
        case "NIGHT_DRIVE_RATIO_LTE":
            return "%";
        default:
            return "";
    }
}

// 목표값 표시 문자열 생성
function formatTargetValue(mission: MissionViewDto): string {
    const unit = getTargetUnit(mission.targetType);
    return `${Number(mission.targetValue).toLocaleString("ko-KR")}${unit}`;
}

// 현재값 표시 문자열 생성
function formatCurrentValue(mission: MissionViewDto): string {
    const unit = getTargetUnit(mission.targetType);
    const current = Number(mission.currentValue);
    const value =
        mission.targetType === "DISTANCE_KM_GTE" || mission.targetType === "NIGHT_DRIVE_RATIO_LTE"
            ? current.toFixed(2)
            : current.toLocaleString("ko-KR");
    return `${value}${unit}`;
}

// 기간 표시 문자열 생성
function formatPeriod(mission: MissionViewDto): string {
    if (mission.missionType === "DAILY") return "오늘";
    if (mission.missionType === "WEEKLY") return "이번 주";
    return "이번 달";
}

// 백엔드 미션 DTO를 카드 모델로 변환
function toMissionItem(mission: MissionViewDto): MissionItem {
    const style = mapMissionStyle(mission.category);
    return {
        id: mission.userMissionId,
        type: mapMissionType(mission.missionType),
        status: mapMissionStatus(mission.status),
        title: mission.title,
        period: formatPeriod(mission),
        progress: Math.max(0, Math.min(100, Number(mission.progressRate))),
        rewardPoint: mission.rewardPoint,
        iconType: style.iconType,
        colorClass: style.colorClass,
        bgClass: style.bgClass,
        current: formatCurrentValue(mission),
        target: formatTargetValue(mission),
    };
}

// 미션 요약 지표 계산
function buildSummary(missions: MissionItem[], safetyScore: number, carbonReductionKg: number) {
    const activeMissionCount = missions.filter((mission) => mission.status === "in_progress").length;
    const weeklyRewardPoint = missions
        .filter((mission) => mission.type === "weekly" && mission.status === "completed")
        .reduce((sum, mission) => sum + mission.rewardPoint, 0);
    const completedCount = missions.filter((mission) => mission.status === "completed").length;
    const monthlyAchievementRate =
        missions.length === 0 ? 0 : Math.round((completedCount / missions.length) * 100);

    return {
        activeMissionCount,
        weeklyRewardPoint,
        monthlyAchievementRate,
        safetyScore,
        carbonReductionKg,
    };
}

// 미션 페이지 표시 데이터 조합
export async function getMissionPageData(): Promise<MissionPageData> {
  const [dailyMissions, weeklyMissions] = await Promise.all([
    getDailyMissions(),
    getWeeklyMissions(),
  ]);

  const [latestScore, latestCarbon] = await Promise.all([
    getLatestDrivingScore().catch(() => ({ snapshotDate: null, score: 0 })),
    getLatestDrivingCarbon().catch(() => ({
      snapshotDate: null,
      carbonReductionKg: 0,
      rewardPoint: 0,
    })),
  ]);

    const missions = [...dailyMissions, ...weeklyMissions].map(toMissionItem);
  const summary = buildSummary(
    missions,
    latestScore.score ?? 0,
    latestCarbon.carbonReductionKg ?? 0,
  );

    return {
        summary,
        missions,
        monthlyRewards,
        guide: missionGuide,
    };
}
