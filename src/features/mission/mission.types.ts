export type MissionType = "daily" | "weekly" | "monthly";

export type MissionStatus = "in_progress" | "completed";

export type MissionIconType = "zap" | "leaf" | "shield" | "trend" | "target";

export type MissionCategory = "ECO" | "SAFETY" | "HABIT";

export type MissionTargetType =
 | "DISTANCE_KM_GTE"
 | "SAFE_SCORE_GTE"
 | "HARD_ACCEL_COUNT_LTE"
 | "HARD_BRAKE_COUNT_LTE"
 | "IDLING_MINUTES_LTE"
 | "NIGHT_DRIVE_RATIO_LTE"
 | "NO_HARD_EVENT_DAYS_GTE";

export type MissionTypeSnapshot = "DAILY" | "WEEKLY" | "MONTHLY";

export type MissionStatusSnapshot = "IN_PROGRESS" | "COMPLETED" | "EXPIRED";

// 백엔드 미션 조회 DTO 타입 정의함
export interface MissionViewDto {
 userMissionId: number;
 missionPolicyId: number;
 title: string;
 description: string | null;
 missionType: MissionTypeSnapshot;
 category: MissionCategory;
 targetType: MissionTargetType;
 targetValue: number;
 currentValue: number;
 progressRate: number;
 rewardPoint: number;
 status: MissionStatusSnapshot;
 slotNo: number;
 periodStartDate: string;
 periodEndDate: string;
 rewardedAt: string | null;
}

export interface MissionItem {
 id: number;
 type: MissionType;
 status: MissionStatus;
 targetType: MissionTargetType;
 periodStartDate: string;
 periodEndDate: string;
 title: string;
 period: string;
 progress: number;
 rewardPoint: number;
 iconType: MissionIconType;
 colorClass: string;
 bgClass: string;
 current: string;
 target: string;
}

export interface MissionSummary {
 activeMissionCount: number;
 weeklyRewardPoint: number;
 monthlyAchievementRate: number;
 safetyScore: number;
 carbonReductionKg: number;
}

export interface MonthlyRewardItem {
 title: string;
 rewardText: string;
 description: string;
 tone: "blue" | "green" | "special";
}

export interface MissionGuide {
 items: string[];
}

export interface MissionPageData {
 summary: MissionSummary;
 missions: MissionItem[];
 monthlyRewards: MonthlyRewardItem[];
 guide: MissionGuide;
}
