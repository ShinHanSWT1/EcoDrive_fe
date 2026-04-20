import { Target } from "lucide-react";
import MissionCard from "./MissionCard";
import type { MissionItem } from "../mission.types";

type MissionListSectionProps = {
 missions: MissionItem[];
};

export default function MissionListSection({
 missions,
}: MissionListSectionProps) {
 return (
 <div className="lg:col-span-2 space-y-6">
 <div className="flex justify-between items-center px-2">
 <h3 className="font-bold text-slate-900 flex items-center gap-2">
 <Target size={20} className="text-blue-600" />
 현재 진행 중인 미션
 </h3>
 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
 Active Missions
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {missions.length === 0 ? (
 <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
 현재 기간에 표시할 미션이 없습니다
 </div>
 ) : (
 missions.map((mission) => (
 <MissionCard key={mission.id} mission={mission} />
 ))
 )}
 </div>
 </div>
 );
}
