import type { MissionGuide, MonthlyRewardItem } from "./mission.types";

// 월간 리워드 패널 표시용 정적 데이터 정의함
export const monthlyRewards: MonthlyRewardItem[] = [
 {
 title: "안전점수 부문",
 rewardText: "+ 5,000 P",
 description: "상위 10명 대상 보너스 포인트 지급함",
 tone: "blue",
 },
 {
 title: "탄소감축 부문",
 rewardText: "+ 5,000 P",
 description: "상위 10명 대상 보너스 포인트 지급함",
 tone: "green",
 },
 {
 title: "종합 우수 드라이버",
 rewardText: "특별 보상",
 description: "보험료 추가 할인권 및 기프트 지급함",
 tone: "special",
 },
];

// 미션 안내 패널 표시용 정적 데이터 정의함
export const missionGuide: MissionGuide = {
 items: [
 "모든 미션은 주행 데이터 기반으로 자동 집계됨",
 "완료 미션 보상은 별도 수령 기능 연결 후 지급 예정임",
 "비정상 주행 패턴 감지 시 집계 결과가 조정될 수 있음",
 ],
};

// 기존 목 기반 의존성 호환용 페이지 데이터 제공함
export const missionPageData = {
 summary: {
 activeMissionCount: 0,
 weeklyRewardPoint: 0,
 monthlyAchievementRate: 0,
 safetyScore: 0,
 carbonReductionKg: 0,
 },
 missions: [],
 monthlyRewards,
 guide: missionGuide,
};
