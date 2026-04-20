import { Medal } from "lucide-react";
import type { MonthlyRewardItem } from "../mission.types";

type MissionRewardPanelProps = {
 rewards: MonthlyRewardItem[];
};

function getRewardCardClass(tone: MonthlyRewardItem["tone"]) {
 if (tone === "special") {
 return "bg-blue-600 rounded-2xl -900/20";
 }

 return "p-4 bg-white/5 rounded-2xl border border-white/10";
}

function getRewardTitleClass(tone: MonthlyRewardItem["tone"]) {
 if (tone === "special") {
 return "text-xs font-bold text-white";
 }

 return "text-xs font-bold text-slate-300";
}

function getRewardValueClass(tone: MonthlyRewardItem["tone"]) {
 if (tone === "blue") return "text-sm font-black text-blue-400";
 if (tone === "green") return "text-sm font-black text-emerald-400";
 return "text-sm font-black text-white";
}

function getRewardDescriptionClass(tone: MonthlyRewardItem["tone"]) {
 if (tone === "special") return "text-[10px] text-blue-100";
 return "text-[10px] text-slate-500";
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

 <div className="bg-slate-900 rounded-[32px] p-6 text-white space-y-6">
 <div className="space-y-1">
 <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">
 Monthly Top Rewards
 </div>
 <h4 className="text-lg font-bold">상위 10명 추가 혜택</h4>
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

 <div className="pt-4 border-t border-white/10">
 <p className="text-[10px] text-slate-500 leading-relaxed italic">
 * 랭킹은 매월 1일 초기화되며, 보상은 익월 5일 이내 지급됩니다.
 </p>
 </div>
 </div>
 </div>
 );
}
