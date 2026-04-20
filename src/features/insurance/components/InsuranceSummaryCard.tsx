import { CheckCircle2, ChevronDown, ChevronUp, Gift, PawPrint } from "lucide-react";
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
 className="w-full mx-auto rounded-[32px] border-[0.5px] border-[#143D60] overflow-hidden relative bg-white"
 >
 <div className="text-right px-6 py-1.5 text-[11px] font-bold text-slate-800 tracking-wide font-sans relative z-10 opacity-70">
 www.shinhancard.com
 </div>
 <div className="w-full h-[60px] bg-[#143D60] relative z-10 mb-6 " />

 <PawPrint size={40} className="absolute top-32 left-[20%] text-[#A0C878] opacity-40 -rotate-12 pointer-events-none" />
 <PawPrint size={30} className="absolute top-40 left-[10%] text-[#A0C878] opacity-40 rotate-12 pointer-events-none" />
 <PawPrint size={60} className="absolute bottom-20 right-[10%] text-[#A0C878] opacity-40 rotate-[30deg] pointer-events-none" />

 <div className="relative z-20 px-6 pb-8">
 
 <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border-[3px] border-[#143D60] flex justify-between items-center ">
 <div>
 <div className="text-slate-500 text-xs font-black mb-1 uppercase tracking-wider flex items-center gap-1">
 <Gift size={14} className="text-blue-500" /> 현재 가입 보험
 </div>
 <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{currentSummary.companyName}</div>
 </div>

 <div className="text-right">
 <div className="text-slate-500 text-xs font-black mb-1 uppercase tracking-wider">
 단독 갱신일
 </div>
 <div className="text-2xl sm:text-3xl font-black text-blue-600">
 D-{currentSummary.renewalDday}
 </div>
 </div>
 </div>
 <div className="text-[10px] font-black text-[#143D60] mt-1 tracking-tight px-2">서명(SIGNATURE)</div>

 <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
 <div className="space-y-4">
 <h4 className="text-sm font-black text-[#143D60] flex items-center gap-2 bg-white/50 w-fit px-3 py-1.5 rounded-full">
 <CheckCircle2 size={18} className="text-emerald-600" />
 할인 조건 팡팡 현황
 </h4>

 <div className="space-y-3">
 <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-4 rounded-3xl border-[0.5px] border-white ">
 <span className="text-[13px] font-bold text-slate-700">안전 점수 80점 초과</span>
 <span className={`text-[10.5px] font-black px-2.5 py-1 rounded-xl ${
 currentSummary.safetyScore == null ? 'text-slate-500 bg-slate-200'
 : currentSummary.safetyScore >= 80 ? 'text-blue-700 bg-white border border-blue-200'
 : 'text-red-600 bg-white border border-red-200'
 }`}>
 {currentSummary.safetyScore == null ? '점수 없음'
 : currentSummary.safetyScore >= 80 ? `달성! (${currentSummary.safetyScore}점)`
 : `아차! (${currentSummary.safetyScore}점)`}
 </span>
 </div>

 <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-4 rounded-3xl border-[0.5px] border-white ">
 <span className="text-[13px] font-bold text-slate-700">연간 주행 1.5만km 이하</span>
 <span className={`text-[10.5px] font-black px-2.5 py-1 rounded-xl ${
 currentSummary.annualMileageKm === 0 
 ? 'text-slate-500 bg-slate-200' 
 : currentSummary.annualMileageKm <= 15000 
 ? 'text-blue-700 bg-white border border-blue-200' 
 : 'text-red-600 bg-white border border-red-200'
 }`}>
 {currentSummary.annualMileageKm === 0 
 ? '달린 기록 없음' 
 : currentSummary.annualMileageKm <= 15000 
 ? `달성! (${formatMileageKm(currentSummary.annualMileageKm)})` 
 : `아차! (${formatMileageKm(currentSummary.annualMileageKm)})`
 }
 </span>
 </div>
 </div>
 </div>

 <div className="md:col-span-2 bg-white rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-[3px] border-[#143D60] relative overflow-hidden">
 <div className="text-center md:text-left relative z-10 w-full">
 <div className="text-xs text-slate-500 font-extrabold mb-1">
 다음 갱신 시 슈퍼 예상 보험료
 </div>
 <div className="flex flex-wrap items-baseline justify-center md:justify-start gap-2">
 <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
 {formatCurrency(currentSummary.expectedPremium)}
 </span>
 <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-xl border border-blue-100 ">
 (-{formatPercent(currentSummary.expectedDiscountRate)})
 </span>
 </div>
 <p className="text-[11px] text-slate-500 mt-4 font-extrabold">
 현재까지 누적 절감액 요정님{" "}
 <span className="text-blue-600 ml-1 bg-blue-50 px-2 py-1 rounded-md">{formatCurrency(currentSummary.totalExpectedSavings)}</span>
 </p>
 </div>

 <motion.button
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 onClick={onToggleBill}
 className="w-full md:w-auto bg-[#143D60] text-white px-6 py-4 rounded-[20px] font-black hover:bg-black transition-all flex items-center justify-center gap-2 relative z-10 shrink-0 whitespace-nowrap"
 >
 산출서 리스트 오픈!
 {showBill ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
 </motion.button>
 </div>
 </div>

 <div className="flex justify-between items-end mt-10 pt-4 border-t-2 border-blue-400/30">
 <div className="flex gap-4">
 <div className="flex items-center gap-1 text-[13px] font-black text-[#27667B] tracking-tight">
 <div className="w-5 h-5 bg-[#27667B] rounded-full text-white flex items-center justify-center text-[10px] italic pr-0.5 pb-0.5 ">S</div> 신한카드
 </div>
 <div className="flex items-center gap-1 text-[13px] font-black text-[#27667B] tracking-tight">
 <div className="w-5 h-5 bg-[#27667B] rounded-full text-white flex items-center justify-center text-[10px] italic pr-0.5 pb-0.5 ">S</div> 신한은행
 </div>
 </div>
 <div className="text-[10px] font-bold text-[#27667B] leading-snug hidden sm:block opacity-80">
 체크카드 상담 1544-7474 | 분실신고 1544-7200
 </div>
 </div>
 </div>

 <InsuranceBillPanel bill={bill} visible={showBill} />
 </motion.div>
 );
}
