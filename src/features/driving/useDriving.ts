import { useState } from "react";
import type { DrivingTab, DrivingDay } from "./driving.types";

export function useDriving() {
  const [activeTab, setActiveTab] = useState<DrivingTab>("history");
  const [selectedDay, setSelectedDay] = useState<DrivingDay>("목");

  return {
    activeTab,
    setActiveTab,
    selectedDay,
    setSelectedDay,
  };
}
