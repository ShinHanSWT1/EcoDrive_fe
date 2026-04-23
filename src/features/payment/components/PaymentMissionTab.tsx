import { Calendar, Clock, ShieldCheck, Zap, Sparkles, Navigation } from "lucide-react";
import type { MissionItem, MissionSummary } from "../../mission/mission.types";
import { cn } from "../../../shared/lib/utils";
import { motion } from "motion/react";

type PaymentMissionTabProps = {
 summary: MissionSummary;
 missions: MissionItem[];
};

function MissionGroupSection({
 title, subtitle, icon, badgeClass, progressClass, pulseClass, items, containerBg, noBorder = false
}: {
 title: string; subtitle: string; icon: React.ReactNode; badgeClass: string; progressClass: string; pulseClass: string; items: MissionItem[]; containerBg: string; noBorder?: boolean;
}) {
 if (items.length === 0) {
 return (
 <div className={`p-8 rounded-[40px] ${noBorder ? '' : `border-4 ${containerBg.replace('bg-', 'border-').replace('/80', '')}`} bg-white `}>
 <div className="flex items-center justify-between mb-6">
 <h4 className="text-2xl font-black text-slate-900 flex items-center gap-3">
 {icon} {title}
 </h4>
 <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full">
 {subtitle}
 </span>
 </div>
 <div className="rounded-[32px] bg-white p-8 text-center text-slate-500 font-bold border-2 border-dashed border-slate-200">
 표시할 신나는 미션이 없어요. 요정들이 준비 중입니다! ✨
 </div>
 </div>
 );
 }

 return (
 <div className={`p-8 rounded-[40px] ${noBorder ? '' : `border-4 ${containerBg.replace('bg-', 'border-').replace('/80', '')}`} bg-white space-y-6`}>
 <div className="flex items-center justify-between px-2">
 <h4 className="text-2xl font-black text-slate-900 flex items-center gap-3">
 {icon} {title}
 </h4>
 <span className="text-xs font-black text-slate-500 uppercase tracking-widest bg-white px-3 py-1 rounded-full ">
 {subtitle}
 </span>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {items.map((mission, index) => {
 const isCompleted = mission.status === "completed";
 const isSafeScoreSettlementPending = mission.targetType === "SAFE_SCORE_GTE" && mission.type !== "daily" && !isCompleted;

 return (
 <motion.div
 whileHover={{ y: -6, rotate: index % 2 === 0 ? -1 : 1 }}
 key={mission.id}
 className="bg-white p-8 rounded-[32px] flex flex-col gap-6 relative overflow-hidden text-left"
 >
 <div className="flex justify-between items-start relative z-10">
 <div>
 <div className={cn("text-[10px] font-black px-3 py-1 rounded-xl w-fit mb-3 tracking-widest uppercase ", badgeClass)}>
 {title}
 </div>
 <h5 className="text-lg font-black text-slate-900 tracking-tight">{mission.title}</h5>
 </div>

 <div className="text-right">
 <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 bg-slate-50 inline-block px-2 py-0.5 rounded-lg">보상 팡팡</div>
 <div className="text-2xl font-black text-[#1A5D40] flex items-center justify-end gap-1">
 <Sparkles size={16} className="text-[#A0C878]" /> {mission.rewardPoint.toLocaleString("ko-KR")}P
 </div>
 </div>
 </div>

 <div className="space-y-4 relative z-10">
 <div className="flex justify-between text-xs font-black">
 <span className="text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
 현재 {mission.current} / 목표 {mission.target}
 </span>
 <span className={isCompleted ? "text-emerald-500 text-sm" : "text-[#1A5D40] text-sm"}>
 {isCompleted ? "미션 완수! 🎉" : `${mission.progress}% 진행 중`}
 </span>
 </div>
 <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
 <motion.div
 initial={{ width: 0 }} animate={{ width: `${Math.min(mission.progress, 100)}%` }}
 transition={{ type: "spring", stiffness: 50, damping: 15 }}
 className={cn("h-full rounded-full relative overflow-hidden", isCompleted ? "bg-[#1A5D40]" : progressClass)}
 >
 <div className="absolute inset-0 bg-[#1a5d40]/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
 </motion.div>
 </div>
 </div>

 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2 border-t-2 border-dashed border-slate-100 relative z-10">
 {isCompleted ? (
 <span className="text-[#1A5D40] flex items-center gap-1 bg-[#1A5D40]/10 px-2 py-1 rounded-lg">
 <ShieldCheck size={14} /> 보상 지급 대기 중
 </span>
 ) : isSafeScoreSettlementPending ? (
 <span className="text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">평가 대기(기간 종료 후 마법 확정!)</span>
 ) : (
 <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
 <div className={cn("w-2 h-2 rounded-full animate-bounce", pulseClass)} />
 요정들이 기록 중
 </div>
 )}
 </div>
 </motion.div>
 );
 })}
 </div>
 </div>
 );
}

export default function PaymentMissionTab({ summary, missions }: PaymentMissionTabProps) {
 const dailyMissions = missions.filter((mission) => mission.type === "daily");
 const weeklyMissions = missions.filter((mission) => mission.type === "weekly");
 const monthlyMissions = missions.filter((mission) => mission.type === "monthly");

 return (
 <div className="space-y-10">
 <div className="bg-white rounded-[50px] p-10 relative overflow-hidden text-left">
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
 <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
 <div className="space-y-4 lg:max-w-sm">
 <div className="inline-flex items-center gap-2 bg-[#143D60]/10 border border-[#143D60]/30 px-3 py-1.5 rounded-2xl text-[#143D60] text-[10px] font-black tracking-widest uppercase">
 <Sparkles size={14} className="text-[#A0C878]" /> 에코드라이브 미션
 </div>
 <h3 className="text-4xl sm:text-5xl font-black text-[#143D60] tracking-tight leading-tight">
 운전 습관이 <br/><span className="text-[#A0C878]">포인트 마법</span>으로!
 </h3>
 <p className="text-sm text-slate-500 font-bold leading-relaxed">
 매일 미션을 달성하고 쏟아지는 리워드로 쏠쏠한 쿠폰 혜택을 챙겨가세요.
 </p>
 </div>
 
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
 <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-[32px] border-4 border-slate-50 flex flex-col justify-center items-center text-center">
 <div className="text-[10px] text-slate-400 font-black uppercase mb-2 tracking-widest">불타는 미션</div>
 <div className="text-3xl font-black text-slate-900">{summary.activeMissionCount}건</div>
 </motion.div>
 <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-[32px] border-[0.5px] border-[#A0C878] flex flex-col justify-center items-center text-center">
 <div className="text-[10px] text-[#27667B] font-black uppercase mb-2 tracking-widest">이번 주 캐시</div>
 <div className="text-2xl sm:text-3xl font-black text-[#143D60]">{summary.weeklyRewardPoint.toLocaleString("ko-KR")}P</div>
 </motion.div>
 <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-[32px] border-[0.5px] border-slate-100 flex flex-col justify-center items-center text-center">
 <div className="text-[10px] text-slate-400 font-black uppercase mb-2 tracking-widest">이달 마스터율</div>
 <div className="text-3xl font-black text-[#1A5D40]">{summary.monthlyAchievementRate}%</div>
 </motion.div>
 <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-[32px] border-[0.5px] border-slate-900 flex flex-col justify-center items-center text-center relative overflow-hidden">
 <div className="absolute top-0 right-0 w-16 h-16 bg-slate-100/50 rounded-full blur-xl"></div>
 <div className="text-[10px] text-slate-400 font-black uppercase mb-2 tracking-widest relative z-10">안전/탄소</div>
 <div className="text-xl font-black text-slate-900 relative z-10">{summary.safetyScore} / {summary.carbonReductionKg}kg</div>
 </motion.div>
 </div>
 </div>
 <Navigation size={240} className="absolute -bottom-20 -left-10 text-white/5 -rotate-45 pointer-events-none" fill="currentColor" />
 </div>

 <MissionGroupSection
 title="일일 미션 타임"
 subtitle="Daily Missions"
 icon={<Clock size={28} className="text-[#1A5D40] bg-white p-1 rounded-xl " />}
 badgeClass="text-[#1A5D40] bg-[#1A5D40]/20 border border-[#1A5D40]/30"
 progressClass="bg-[#1A5D40]"
 pulseClass="bg-[#1A5D40]"
 items={dailyMissions}
 containerBg="bg-[#1A5D40]/10"
 />

 <MissionGroupSection
 title="주간 미션 챌린지"
 subtitle="Weekly Goals"
 icon={<Calendar size={28} className="text-indigo-600 bg-white p-1 rounded-xl " />}
 badgeClass="text-indigo-600 bg-indigo-100 border border-indigo-200"
 progressClass="bg-[#1A5D40]"
 pulseClass="bg-indigo-500"
 items={weeklyMissions}
 containerBg="bg-indigo-50/80"
 noBorder
 />

 <MissionGroupSection
 title="월간 스페셜 목표"
 subtitle="Monthly Goals"
 icon={<Calendar size={28} className="text-[#1A5D40] bg-white p-1 rounded-xl " />}
 badgeClass="text-[#1A5D40] bg-[#1A5D40]/20 border border-[#1A5D40]/30"
 progressClass="bg-[#1A5D40]"
 pulseClass="bg-[#1A5D40]"
 items={monthlyMissions}
 containerBg="bg-[#1A5D40]/10"
 />
 </div>
 );
}
