import { missionPageData } from "../mission/mission.mock";
import type { PaymentData } from "./payment.types";

export const paymentMockData: PaymentData = {
  user: {
    name: "김철수",
    score: 88,
    carbonReduction: 12.4,
    points: 0,
    balance: 128450,
    monthlyUsage: 41200,
  },
  walletMissing: false,
  wallet: {
    payUserId: 1,
    payAccountId: 1,
    accountNumber: "110-1234-5678",
    bankCode: "004",
    ownerName: "김철수",
    status: "ACTIVE",
  },

  categories: [
    { id: "all", label: "전체" },
    { id: "fuel", label: "주유/충전" },
    { id: "parking", label: "주차" },
    { id: "wash", label: "세차" },
    { id: "maintenance", label: "정비" },
    { id: "store", label: "편의점" },
    { id: "cafe", label: "카페" },
  ],

  products: [
    {
      id: 1,
      name: "GS칼텍스 5,000원 주유권",
      price: 4500,
      originalPrice: 5000,
      category: "fuel",
      image: "https://picsum.photos/seed/fuel/400/300",
      discountLabel: "10%",
    },
    {
      id: 2,
      name: "모두의주차장 3,000원 할인권",
      price: 2400,
      originalPrice: 3000,
      category: "parking",
      image: "https://picsum.photos/seed/parking/400/300",
      discountLabel: "20%",
    },
    {
      id: 3,
      name: "스타벅스 아메리카노 T",
      price: 4050,
      originalPrice: 4500,
      category: "cafe",
      image: "https://picsum.photos/seed/coffee/400/300",
      discountLabel: "10%",
    },
  ],

  recentHistory: [
    {
      id: 1,
      title: "잔액 충전",
      date: "2026.04.10",
      amount: 20000,
      type: "earn",
      category: "충전",
    },
    {
      id: 2,
      title: "GS칼텍스 주유권 구매",
      date: "2026.04.09",
      amount: 4500,
      type: "pay",
      category: "주유",
    },
    {
      id: 3,
      title: "스타벅스 쿠폰 구매",
      date: "2026.04.08",
      amount: 4050,
      type: "pay",
      category: "카페",
    },
    {
      id: 4,
      title: "미션 보상 적립",
      date: "2026.04.07",
      amount: 1200,
      type: "earn",
      category: "미션",
    },
  ],

  allHistory: [
    {
      id: 1,
      title: "잔액 충전",
      date: "2026.04.10",
      amount: 20000,
      type: "earn",
      category: "충전",
    },
    {
      id: 2,
      title: "GS칼텍스 주유권 구매",
      date: "2026.04.09",
      amount: 4500,
      type: "pay",
      category: "주유",
    },
    {
      id: 3,
      title: "스타벅스 쿠폰 구매",
      date: "2026.04.08",
      amount: 4050,
      type: "pay",
      category: "카페",
    },
    {
      id: 4,
      title: "미션 보상 적립",
      date: "2026.04.07",
      amount: 1200,
      type: "earn",
      category: "미션",
    },
  ],

  pointHistory: [
    {
      id: 1,
      title: "주간 미션 보상",
      date: "2026.04.06",
      amountText: "+1,500",
      type: "earn",
    },
    {
      id: 2,
      title: "주유권 구매",
      date: "2026.04.05",
      amountText: "-4,500",
      type: "use",
    },
  ],

  coupons: [
    {
      id: 1,
      templateId: 1,
      name: "스타벅스 10% 할인",
      expiry: "2026.04.30",
      discount: "10%",
      category: "카페",
      description: "제휴 카페 결제 시 즉시 할인 적용됩니다.",
      image: "https://picsum.photos/seed/mock-coupon-1/400/300",
      used: false,
    },
    {
      id: 2,
      templateId: 2,
      name: "GS25 1,000원 금액권",
      expiry: "2026.04.25",
      discount: "1,000원",
      category: "편의점",
      description: "편의점 제휴 매장에서 사용할 수 있습니다.",
      image: "https://picsum.photos/seed/mock-coupon-2/400/300",
      used: false,
    },
  ],

  historySummary: {
    earnedPoint: 1500,
    usedPoint: 4500,
    extraPoint: 3200,
  },

  missionSummary: missionPageData.summary,
  missions: missionPageData.missions,
};
