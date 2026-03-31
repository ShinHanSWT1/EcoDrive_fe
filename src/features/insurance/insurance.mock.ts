import type {
  InsuranceBill,
  InsuranceCompany,
  CurrentInsuranceSummary,
  InsuranceGuide,
} from "./insurance.types";

export const currentInsuranceSummary: CurrentInsuranceSummary = {
  companyName: "현대해상 다이렉트 자동차보험",
  renewalDday: 45,
  safetyScore: 88,
  annualMileageKm: 12000,
  connectedCarLinked: true,
  expectedPremium: 854200,
  expectedDiscountRate: 15.4,
  totalExpectedSavings: 155800,
};

export const insuranceCompanies: InsuranceCompany[] = [
  {
    name: "삼성화재",
    logo: "삼성",
    discountRate: 12.5,
    expectedPremium: 842000,
    tags: ["T맵 연동", "마일리지 특약"],
    reason: "현재 안전점수 88점 기준 최대 할인 가능",
  },
  {
    name: "DB손해보험",
    logo: "DB",
    discountRate: 15.2,
    expectedPremium: 798000,
    tags: ["안전점수 80점↑", "자녀할인"],
    reason: "커넥티드카 연동 조건 충족 시 가장 유리",
  },
  {
    name: "KB손해보험",
    logo: "KB",
    discountRate: 14.8,
    expectedPremium: 812000,
    tags: ["커넥티드카", "블랙박스"],
    reason: "안전점수 85점 이상 시 추가 혜택 제공",
  },
  {
    name: "현대해상",
    logo: "현대",
    discountRate: 11.0,
    expectedPremium: 865000,
    tags: ["차선이탈방지", "전방충돌방지"],
    reason: "기존 가입 고객 갱신 할인 혜택 강화",
  },
];

export const insuranceBill: InsuranceBill = {
  issuedAt: "2026.03.26",
  contractNumber: "ED-2026-0326-001",
  basePremium: 1010000,
  discountItems: [
    {
      label: "안전운전 할인",
      amount: 101000,
      badge: "88점 적용",
      tone: "blue",
    },
    {
      label: "마일리지 할인",
      amount: 54800,
      badge: "1.2만km 적용",
      tone: "green",
    },
  ],
  totalDiscountRate: 15.4,
  finalPremium: 854200,
};

export const insuranceGuide: InsuranceGuide = {
  title: "보험료 절감 가이드",
  description:
    "안전운전 점수가 90점을 넘으면 삼성화재에서 추가 3% 할인을 더 받을 수 있습니다. 야간 운전 비중을 5%만 더 줄여보세요!",
};
