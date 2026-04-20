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

export interface DriverInsightCardData {
  title: string;
  badge: string;
  styleLabel: string | null;
  summary: string | null;
  insight: string | null;
  isDefault: boolean;
}

export interface DashboardData {
  totalSavings: number;
  pointBalance: number;
  todayEarnedPoints: number;
  driverInsight: DriverInsightCardData;
  summaryNote: string;
  stats: DashboardStatCard[];
  savingsChart: SavingsChartItem[];
  todayDrivingSummary: TodayDrivingSummaryItem[];
  insurancePreviews: InsurancePreviewItem[];
}
