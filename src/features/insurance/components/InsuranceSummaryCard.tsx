import { CheckCircle2, ChevronDown, ChevronUp, Gift, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import type {
 CurrentInsuranceSummary,
 InsuranceBill,
} from "../insurance.types";
import {
 formatCurrency,
 formatMileageKm,
 formatPercent,
} from "../../../shared/lib/format";
import InsuranceBillPanel from "./InsuranceBillPanel";

type InsuranceSummaryCardProps = {
 currentSummary: CurrentInsuranceSummary;
 bill: InsuranceBill;
 showBill: boolean;
 onToggleBill: () => void;
};

export default function InsuranceSummaryCard({
 currentSummary,
 bill,
 showBill,
 onToggleBill,
}: InsuranceSummaryCardProps) {
 return (
 <motion.div 
 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring" }}
 className="w-full mx-auto rounded-[40px] overflow-hidden relative bg-white border border-slate-100 shadow-sm"
 >
 <div className="relative z-20 px-6 py-10 md:px-10">
 
 {/* 상단: 가입 보험 정보 */}
 <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
 <div className="flex flex-col items-center sm:items-start gap-3">
 <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
 <Gift size={14} className="text-[#1A5D40]" /> 현재 가입 보험
 </div>
 <div className="flex items-center gap-4">
 <div className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">{currentSummary.companyName}</div>
 <img 
 src="/media/KakaoTalk_20260421_004941154.png" 
 alt="보험 차량" 
 className="w-20 h-20 md:w-24 md:h-24 object-contain animate-bounce-subtle"
 />
 </div>
 </div>

 <div className="flex flex-col items-center sm:items-end gap-2 bg-slate-50 px-6 py-4 rounded-3xl border border-slate-100 min-w-[140px]">
 <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
 단독 갱신일
 </div>
 <div className="text-2xl md:text-3xl font-black text-[#1A5D40] font-mono">
 D-{currentSummary.renewalDday}
 </div>
 </div>
 </div>

 {/* 점선 구분선: 확실하게 보이도록 마진과 두께 조정 */}
 <div className="my-10 border-t-2 border-dashed border-[#1A5D40]/20 relative">
 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4">
 <Sparkles className="text-amber-300" size={24} />
 </div>
 </div>

 {/* 중단: 할인 조건 현황 */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
 <div className="space-y-6">
 <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
 <CheckCircle2 size={20} className="text-[#1A5D40]" />
 할인 조건 팡팡 현황
 </h4>

 <div className="space-y-3">
 <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
 <span className="text-[15px] font-bold text-slate-600">안전 점수 80점 초과</span>
 <span className={`text-[13px] font-black px-3 py-1 rounded-full ${
 currentSummary.safetyScore == null ? 'text-slate-400 bg-slate-200'
 : currentSummary.safetyScore >= 80 ? 'text-[#1A5D40] bg-[#1A5D40]/10 border border-[#1A5D40]/20'
 : 'text-rose-600 bg-rose-50 border border-rose-100'
 }`}>
 {currentSummary.safetyScore == null ? '점수 없음'
 : currentSummary.safetyScore >= 80 ? `달성! (${currentSummary.safetyScore}점)`
 : `미달성 (${currentSummary.safetyScore}점)`}
 </span>
 </div>

 <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
 <span className="text-[15px] font-bold text-slate-600">연간 주행 1.5만km 이하</span>
 <span className={`text-[13px] font-black px-3 py-1 rounded-full ${
 currentSummary.annualMileageKm === 0 ? 'text-slate-400 bg-slate-200'
 : currentSummary.annualMileageKm <= 15000 ? 'text-[#1A5D40] bg-[#1A5D40]/10 border border-[#1A5D40]/20'
 : 'text-rose-600 bg-rose-50 border border-rose-100'
 }`}>
 {currentSummary.annualMileageKm === 0 ? '기록 없음' 
 : currentSummary.annualMileageKm <= 15000 ? `달성! (${formatMileageKm(currentSummary.annualMileageKm)})` 
 : `미달성 (${formatMileageKm(currentSummary.annualMileageKm)})`}
 </span>
 </div>
 </div>
 </div>

 {/* 하단: 예상 보험료 및 누적 절감액 */}
 <div className="flex flex-col justify-between">
 <div className="bg-[#1A5D40]/5 rounded-[32px] p-6 md:p-8 border border-[#1A5D40]/10 relative overflow-hidden h-full flex flex-col justify-center">
 <div className="text-xs text-slate-400 font-black mb-2 uppercase tracking-widest">
 NEXT RENEWAL PREMIUM
 </div>
 <div className="flex items-baseline gap-2 mb-4">
 <span className="text-3xl md:text-4xl font-black text-slate-900 font-mono tracking-tight">
 {formatCurrency(currentSummary.expectedPremium)}
 </span>
 <span className="text-sm font-black text-[#1A5D40] bg-white px-2 py-0.5 rounded-lg shadow-sm border border-[#1A5D40]/10">
 -{formatPercent(currentSummary.expectedDiscountRate)}
 </span>
 </div>
 
 <div className="pt-4 border-t border-slate-200/50 flex items-center justify-between">
 <span className="text-[13px] font-bold text-slate-500">현재까지 누적 절감액</span>
 <span className="text-base font-black text-[#1A5D40]">{formatCurrency(currentSummary.totalExpectedSavings)}</span>
 </div>
 </div>
 </div>
 </div>

 {/* 산출서 리스트 오픈 버튼 - 더 직관적으로 변경 */}
 <div className="pt-4 border-t border-slate-100">
 <motion.button
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 onClick={onToggleBill}
 className={`w-full flex items-center justify-between px-8 py-5 rounded-[24px] transition-all ${
 showBill 
 ? 'bg-slate-900 text-white shadow-lg' 
 : 'bg-[#1A5D40] text-white hover:bg-[#1A5D40]/90 shadow-md'
 }`}
 >
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
 {showBill ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
 </div>
 <span className="text-lg font-black tracking-tight">
 {showBill ? '산출서 상세 닫기' : '나의 초특급 할인 산출서 보기'}
 </span>
 </div>
 <div className="flex items-center gap-1.5 bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold">
 <Sparkles size={14} /> 실시간 반영 중
 </div>
 </motion.button>
 </div>
 </div>

 <InsuranceBillPanel bill={bill} visible={showBill} />
 </motion.div>
 );
}
