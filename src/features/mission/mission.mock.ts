import type {
  MissionGuide,
  MissionItem,
  MissionPageData,
  MissionSummary,
  MonthlyRewardItem,
} from "./mission.types";

const missionSummary: MissionSummary = {
  activeMissionCount: 6,
  weeklyRewardPoint: 3500,
  monthlyAchievementRate: 72,
  safetyScore: 88,
  carbonReductionKg: 12.4,
};

const missions: MissionItem[] = [
  {
    id: 1,
    type: "daily",
    title: "급가속 3회 이하 유지",
    period: "오늘",
    progress: 33,
    rewardPoint: 500,
    iconType: "zap",
    colorClass: "text-orange-500",
    bgClass: "bg-orange-50",
    current: "1회",
    target: "3회",
  },
  {
    id: 2,
    type: "daily",
    title: "공회전 시간 5분 이하",
    period: "오늘",
    progress: 40,
    rewardPoint: 300,
    iconType: "leaf",
    colorClass: "text-green-500",
    bgClass: "bg-green-50",
    current: "2분",
    target: "5분",
  },
  {
    id: 3,
    type: "weekly",
    title: "안전점수 평균 85점 이상",
    period: "이번 주",
    progress: 100,
    rewardPoint: 1500,
    iconType: "shield",
    colorClass: "text-blue-500",
    bgClass: "bg-blue-50",
    current: "88점",
    target: "85점",
  },
  {
    id: 4,
    type: "weekly",
    title: "정속주행 비율 70% 이상",
    period: "이번 주",
    progress: 92,
    rewardPoint: 1200,
    iconType: "trend",
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-50",
    current: "65%",
    target: "70%",
  },
  {
    id: 5,
    type: "monthly",
    title: "탄소 절감 10kg 달성",
    period: "이번 달",
    progress: 100,
    rewardPoint: 3000,
    iconType: "leaf",
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
    current: "12.4kg",
    target: "10kg",
  },
  {
    id: 6,
    type: "monthly",
    title: "위험 이벤트 20% 감소",
    period: "이번 달",
    progress: 75,
    rewardPoint: 5000,
    iconType: "target",
    colorClass: "text-red-500",
    bgClass: "bg-red-50",
    current: "15%",
    target: "20%",
  },
];

const monthlyRewards: MonthlyRewardItem[] = [
  {
    title: "안전점수 부문",
    rewardText: "+ 5,000 P",
    description: "상위 10명에게 보너스 포인트 지급",
    tone: "blue",
  },
  {
    title: "탄소 절감 부문",
    rewardText: "+ 5,000 P",
    description: "상위 10명에게 보너스 포인트 지급",
    tone: "green",
  },
  {
    title: "종합 우수 드라이버",
    rewardText: "특별 보상",
    description: "보험료 추가 할인권 및 기프트",
    tone: "special",
  },
];

const missionGuide: MissionGuide = {
  items: [
    "모든 미션은 주행 시 자동 참여됩니다.",
    "포인트는 미션 달성 즉시 또는 정해진 기한 내 지급됩니다.",
    "부정한 방법으로 참여 시 혜택이 취소될 수 있습니다.",
  ],
};

export const missionPageData: MissionPageData = {
  summary: missionSummary,
  missions,
  monthlyRewards,
  guide: missionGuide,
};
