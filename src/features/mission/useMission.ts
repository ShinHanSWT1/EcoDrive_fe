import { useEffect, useState } from "react";
import { getMissionPageData } from "./mission.api";
import type { MissionPageData } from "./mission.types";

export function useMission() {
 const [data, setData] = useState<MissionPageData | null>(null);
 const [isLoading, setIsLoading] = useState(true);
 const [isError, setIsError] = useState(false);

 useEffect(() => {
 let mounted = true;

 async function fetchMissionData() {
 try {
 setIsLoading(true);
 setIsError(false);

 const result = await getMissionPageData();

 if (mounted) {
 setData(result);
 }
 } catch (error) {
 console.error("미션 데이터 조회 실패:", error);
 if (mounted) {
 setIsError(true);
 }
 } finally {
 if (mounted) {
 setIsLoading(false);
 }
 }
 }

 fetchMissionData();

 return () => {
 mounted = false;
 };
 }, []);

 return {
 data,
 isLoading,
 isError,
 };
}
