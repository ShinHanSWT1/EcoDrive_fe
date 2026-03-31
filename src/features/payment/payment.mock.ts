import { missionPageData } from "../mission/mission.mock";
import type { PaymentData } from "./payment.types";

export const paymentMockData: PaymentData = {
  user: {
    name: "김철수",
    score: 88,
    carbonReduction: 12.4,
    points: 6300,
    balance: 128450,
    monthlyUsage: 41200,
  },

  categories: [
    { id: "all", label: "전체" },
    { id: "fuel", label: "주유/충전" },
    { id: "parking", label: "주차장" },
    { id: "wash", label: "세차" },
    { id: "maintenance", label: "정비/부품" },
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
      name: "컴인워시 노터치 세차권",
      price: 12000,
      originalPrice: 15000,
      category: "wash",
      image: "https://picsum.photos/seed/wash/400/300",
      discountLabel: "20%",
    },
    {
      id: 4,
      name: "오토오아시스 엔진오일 교환권",
      price: 45000,
      originalPrice: 65000,
      category: "maintenance",
      image: "https://picsum.photos/seed/maint/400/300",
      discountLabel: "30%",
    },
    {
      id: 5,
      name: "S-OIL 10,000원 주유권",
      price: 9500,
      originalPrice: 10000,
      category: "fuel",
      image: "https://picsum.photos/seed/soil/400/300",
      discountLabel: "5%",
    },
    {
      id: 6,
      name: "아이파킹 1일 주차권",
      price: 15000,
      originalPrice: 20000,
      category: "parking",
      image: "https://picsum.photos/seed/iparking/400/300",
      discountLabel: "25%",
    },
  ],

  recentHistory: [
    {
      id: 1,
      title: "GS25 편의점",
      date: "2026.03.30",
      amount: 4800,
      type: "pay",
      category: "생활",
    },
    {
      id: 2,
      title: "스타벅스 커피 쿠폰",
      date: "2026.03.29",
      amount: 3900,
      type: "pay",
      category: "쇼핑",
    },
    {
      id: 3,
      title: "현대해상 보험료 선결제",
      date: "2026.03.28",
      amount: 50000,
      type: "pay",
      category: "보험",
    },
    {
      id: 4,
      title: "리워드 스토어 상품권",
      date: "2026.03.27",
      amount: 12000,
      type: "pay",
      category: "쇼핑",
    },
    {
      id: 5,
      title: "안전운전 미션 보상",
      date: "2026.03.26",
      amount: 1200,
      type: "earn",
      category: "미션",
    },
  ],

  pointHistory: [
    {
      id: 1,
      title: "3월 안전운전 보너스 적립",
      date: "2026.03.25",
      amountText: "+2,450",
      type: "earn",
    },
    {
      id: 2,
      title: "GS칼텍스 주유권 구매",
      date: "2026.03.22",
      amountText: "-4,500",
      type: "use",
    },
    {
      id: 3,
      title: "탄소 절감 미션 달성",
      date: "2026.03.15",
      amountText: "+1,200",
      type: "earn",
    },
    {
      id: 4,
      title: "신규 가입 축하 포인트",
      date: "2026.03.01",
      amountText: "+5,000",
      type: "earn",
    },
  ],

  coupons: [
    { id: 1, name: "주유 5,000원 할인권", expiry: "2026.04.12", used: false },
    { id: 2, name: "공영주차장 1시간 무료", expiry: "2026.03.30", used: false },
  ],

  historySummary: {
    earnedPoint: 2450,
    usedPoint: 4500,
    extraPoint: 3200,
  },

  missionSummary: missionPageData.summary,
  missions: missionPageData.missions,
};
