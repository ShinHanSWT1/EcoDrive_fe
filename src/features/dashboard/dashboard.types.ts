export interface DashboardStatCard {
 id: string;
 label: string;
 value: number | string;
 subText: string;
 changeText?: string;
 tone: "dark" | "orange" | "blue" | "green";
}

export interface SavingsChartItem {
 name: string;
 savings: number;
}

export interface TodayDrivingSummaryItem {
 id: string;
 title: string;
 description: string;
 statusText: string;
 statusTone: "normal" | "danger";
 icon: "car" | "trendDown";
}

export interface InsurancePreviewItem {
 name: string;
 discountRate: number;
 premium: number;
}

export interface DashboardData {
 totalSavings: number;
 pointBalance: number;
 todayEarnedPoints: number;
 summaryNote: string;
 stats: DashboardStatCard[];
 savingsChart: SavingsChartItem[];
 todayDrivingSummary: TodayDrivingSummaryItem[];
 insurancePreviews: InsurancePreviewItem[];
 // 새롭게 추가된 지표들
 todayMetrics?: {
   totalDistance: number;
   avgSpeed: number;
   maxSpeed: number;
   idlingTime: number;
   ecoScore: number;
 };
}
