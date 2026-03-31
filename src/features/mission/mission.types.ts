export type MissionType = "daily" | "weekly" | "monthly";

export type MissionStatus = "in_progress" | "completed";

export type MissionIconType = "zap" | "leaf" | "shield" | "trend" | "target";

export interface MissionItem {
  id: number;
  type: MissionType;
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
