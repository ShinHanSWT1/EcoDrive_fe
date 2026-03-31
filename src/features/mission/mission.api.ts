import { missionPageData } from "./mission.mock";
import type { MissionPageData } from "./mission.types";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getMissionPageData(): Promise<MissionPageData> {
  await delay(300);
  return missionPageData;
}
