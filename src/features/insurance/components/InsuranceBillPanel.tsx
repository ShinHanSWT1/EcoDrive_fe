import { AnimatePresence, motion } from "motion/react";
import { Receipt, Sparkles } from "lucide-react";
import type { InsuranceBill } from "../insurance.types";
import { formatCurrency, formatPercent } from "../../../shared/lib/format";

type InsuranceBillPanelProps = {
 bill: InsuranceBill;
 visible: boolean;
};

const badgeToneClassMap = {
 default: "text-slate-600 bg-slate-100",
 blue: "text-[#1A5D40] bg-[#1A5D40]/10",
 green: "text-[#1A5D40] bg-[#1A5D40]/10",
};

export default function InsuranceBillPanel({
 bill,
 visible,
}: InsuranceBillPanelProps) {
 return (
 <AnimatePresence>
 {visible && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="overflow-hidden border-t-4 border-dashed border-slate-100 bg-white"
 >
 <div className="p-6 md:p-10 max-w-2xl mx-auto">
 {/* 고품격 영수증 디자인 */}
 <div className="bg-white p-8 md:p-10 rounded-[40px] relative border-[0.5px] border-slate-200 shadow-sm">
 {/* 티켓 펀치 효과 */}
 <div className="absolute -left-6 top-1/2 w-12 h-12 bg-white rounded-full border-r-[0.5px] border-slate-200"></div> 
 <div className="absolute -right-6 top-1/2 w-12 h-12 bg-white rounded-full border-l-[0.5px] border-slate-200"></div>

 {/* 헤더 영역 */}
 <div className="mb-10 relative z-10 text-center">
 <div className="flex items-center justify-center gap-2 mb-4">
 <Receipt className="text-[#1A5D40]" size={32} />
 <h5 className="text-2xl font-black text-slate-900">초특급 할인 산출서</h5>
 </div>
 
 <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
 <div className="text-left">
 <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">발행일 요정</div>
 <div className="text-xs font-black text-slate-700">{bill.issuedAt}</div>
 </div>
 <div className="hidden sm:block h-6 w-px bg-slate-200"></div>
 <div className="text-right">
 <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">시크릿 계약번호</div>
 <div className="text-xs font-black text-[#1A5D40]">{bill.contractNumber}</div>
 </div>
 </div>
 </div>

 <div className="space-y-6 relative z-10 px-2">
 {/* 기본 보험료 */}
 <div className="flex justify-between items-end">
 <div className="space-y-1">
 <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">INSURANCE PLAN</div>
 <div className="text-base font-bold text-slate-800">
 {bill.productNameLabel || "에코드라이브 자동차보험"}
 </div>
 </div>
 <div className="text-xl font-black text-slate-900">
 {formatCurrency(bill.basePremium)}
 </div>
 </div>

 <div className="h-px bg-slate-100"></div>

 {/* 할인 내역 */}
 <div className="space-y-4">
 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DISCOUNT ITEMS</div>
 {bill.discountItems.map((item) => (
 <div key={item.label} className="flex justify-between items-center group">
 <div className="flex items-center gap-3">
 <span className="text-sm font-bold text-slate-600 transition-colors group-hover:text-slate-900">
 {item.label}
 </span>
 {item.badge && (
 <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${badgeToneClassMap[item.tone ?? "default"]}`}>
 {item.badge}
 </span>
 )}
 </div>
 <span className="font-black text-[#1A5D40] text-base">
 - {formatCurrency(item.amount)}
 </span>
 </div>
 ))}
 </div>

 {/* 구분선 */}
 <div className="border-t-2 border-dashed border-slate-200 my-8 relative">
 <Sparkles className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-300 bg-white px-2" size={24} />
 </div>

 {/* 총 할인율 */}
 <div className="flex justify-between items-center mb-6 px-2">
 <span className="text-lg font-black text-slate-900 flex items-center gap-2">
 현재 모아온 총 할인율 🎉
 </span>
 <span className="text-2xl font-black text-[#1A5D40]">
 {formatPercent(bill.totalDiscountRate)}
 </span>
 </div>

 {/* 최종 금액 박스 */}
 <div className="bg-[#1A5D40] p-6 rounded-[32px] text-white shadow-lg shadow-[#1A5D40]/20 transform transition-transform hover:scale-[1.02]">
 <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
 <span className="text-base font-bold text-white/80">
 최종 갱신 시 예상결제액
 </span>
 <div className="text-right">
 <span className="text-3xl md:text-4xl font-black tracking-tight">
 {formatCurrency(bill.finalPremium)}
 </span>
 </div>
 </div>
 </div>
 </div>

 {/* 푸터 안내 문구 */}
 <div className="mt-10 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
 <p className="text-[11px] text-slate-400 font-bold text-center leading-relaxed">
 * 위 금액은 주행 데이터를 분석해 산출한 예상 마법 금액입니다!<br/> 
 실제 갱신 시점에 따라 요정의 장난으로 변동될 수 있습니다.
 </p>
 </div>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
