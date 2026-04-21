import { Medal } from "lucide-react";
import type { MonthlyRewardItem } from "../mission.types";

type MissionRewardPanelProps = {
 rewards: MonthlyRewardItem[];
};

function getRewardCardClass(tone: MonthlyRewardItem["tone"]) {
 if (tone === "special") {
 return "p-4 bg-[#1A5D40] rounded-2xl";
 }

 return "p-4 bg-white/50 rounded-2xl border border-[#1A5D40]/20";
}

function getRewardTitleClass(tone: MonthlyRewardItem["tone"]) {
 if (tone === "special") {
 return "text-xs font-bold text-white";
 }

 return "text-xs font-bold text-slate-700";
}

function getRewardValueClass(tone: MonthlyRewardItem["tone"]) {
 if (tone === "blue") return "text-sm font-black text-[#1A5D40]";
 if (tone === "green") return "text-sm font-black text-[#1A5D40]";
 return "text-sm font-black text-white";
}

function getRewardDescriptionClass(tone: MonthlyRewardItem["tone"]) {
 if (tone === "special") return "text-[10px] text-white/80";
 return "text-[10px] text-slate-600";
}

export default function MissionRewardPanel({
 rewards,
}: MissionRewardPanelProps) {
 return (
 <div className="space-y-6">
 <div className="flex justify-between items-center px-2">
 <h3 className="font-bold text-slate-900 flex items-center gap-2">
 <Medal size={20} className="text-orange-500" />
 월간 우수 드라이버
 </h3>
 </div>

 <div className="bg-[#A0C878] rounded-[32px] p-6 space-y-6 border-b-4 border-[#1A5D40]">
 <div className="space-y-1">
 <div className="text-[10px] text-[#1A5D40] font-bold uppercase tracking-widest">
 Monthly Top Rewards
 </div>
 <h4 className="text-lg font-bold text-slate-900">상위 10명 추가 혜택</h4>
 </div>

 <div className="space-y-4">
 {rewards.map((reward) => (
 <div key={reward.title} className={getRewardCardClass(reward.tone)}>
 <div className="flex justify-between items-center mb-1">
 <span className={getRewardTitleClass(reward.tone)}>
 {reward.title}
 </span>
 <span className={getRewardValueClass(reward.tone)}>
 {reward.rewardText}
 </span>
 </div>
 <p className={getRewardDescriptionClass(reward.tone)}>
 {reward.description}
 </p>
 </div>
 ))}
 </div>

 <div className="pt-4 border-t border-[#1A5D40]/30">
 <p className="text-[10px] text-slate-700 leading-relaxed italic">
 * 랭킹은 매월 1일 초기화되며, 보상은 익월 5일 이내 지급됩니다.
 </p>
 </div>
 </div>
 </div>
 );
}
