import type { MissionItem, MissionSummary } from "../mission/mission.types";

export type PaymentTab = "home" | "history" | "mission";

export interface PaymentUserSummary {
  name: string;
  score: number;
  carbonReduction: number;
  points: number;
  balance: number;
  monthlyUsage: number;
}

export interface PaymentCategory {
  id: string;
  label: string;
}

export interface PaymentProduct {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  discountLabel: string;
}

export interface PaymentHistoryItem {
  id: number;
  title: string;
  date: string;
  amount: number;
  type: "pay" | "earn";
  category: string;
}

export interface PaymentPointHistoryItem {
  id: number;
  title: string;
  date: string;
  amountText: string;
  type: "earn" | "use";
}

export interface PaymentCouponItem {
  id: number;
  name: string;
  expiry: string;
  used: boolean;
}

export interface PaymentHistorySummary {
  earnedPoint: number;
  usedPoint: number;
  extraPoint: number;
}

export interface PaymentData {
  user: PaymentUserSummary;
  categories: PaymentCategory[];
  products: PaymentProduct[];
  recentHistory: PaymentHistoryItem[];
  pointHistory: PaymentPointHistoryItem[];
  coupons: PaymentCouponItem[];
  historySummary: PaymentHistorySummary;
  missionSummary: MissionSummary;
  missions: MissionItem[];
}
