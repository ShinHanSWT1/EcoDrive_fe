import { dashboardMockData } from "./dashboard.mock";
import type { DashboardData } from "./dashboard.types";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDashboardData(): Promise<DashboardData> {
  await delay(300);
  return dashboardMockData;
}
