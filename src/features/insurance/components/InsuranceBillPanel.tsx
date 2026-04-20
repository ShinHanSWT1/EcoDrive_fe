import { AnimatePresence, motion } from "motion/react";
import { Receipt } from "lucide-react";
import type { InsuranceBill } from "../insurance.types";
import { formatCurrency, formatPercent } from "../../../shared/lib/format";

type InsuranceBillPanelProps = {
  bill: InsuranceBill;
  visible: boolean;
};

const badgeToneClassMap = {
  default: "text-slate-600 bg-slate-100",
  blue: "text-blue-600 bg-blue-50",
  green: "text-emerald-600 bg-emerald-50",
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
          className="overflow-hidden border-t-4 border-dashed border-slate-100 bg-[#F4F9FF]"
        >
          <div className="p-6 md:p-10 max-w-2xl mx-auto">
            {/* 귀여운 영수증/티켓 디자인 */}
            <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-[0_20px_50px_rgb(0,0,0,0.08)] relative border-4 border-white">
              <div className="absolute top-0 left-10 right-10 h-6 bg-[#FEE500] rounded-b-3xl shadow-inner flex justify-center items-end pb-1">
                <span className="w-20 h-1 bg-black/10 rounded-full"></span>
              </div>

              <div className="absolute -left-6 top-1/2 w-12 h-12 bg-[#F4F9FF] rounded-full"></div>
              <div className="absolute -right-6 top-1/2 w-12 h-12 bg-[#F4F9FF] rounded-full"></div>

              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10 mt-6 relative z-10">
                <div>
                  <h5 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Receipt className="text-[#FEE500] drop-shadow-sm" fill="#191600" size={28} />
                    초특급 할인 산출서
                  </h5>
                  <p className="text-xs text-blue-500 mt-2 font-bold px-3 py-1 bg-blue-50 rounded-full inline-block">
                    발행일 요정: {bill.issuedAt}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md mb-1 inline-block">
                    시크릿 계약번호
                  </div>
                  <div className="text-base font-black text-slate-900 tracking-wider">
                    {bill.contractNumber}
                  </div>
                </div>
              </div>

              <div className="space-y-5 relative z-10">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 px-5 bg-slate-50 rounded-3xl gap-1">
                  <span className="text-slate-500 font-extrabold text-sm md:text-base">
                    {bill.productNameLabel || "기본 든든 보험료"}
                  </span>
                  <span className="font-black text-slate-900 text-lg">
                    {formatCurrency(bill.basePremium)}
                  </span>
                </div>

                {bill.discountItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 px-5 gap-1"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-black text-sm md:text-base">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-black px-2 py-1 rounded-lg shadow-sm ${
                            badgeToneClassMap[item.tone ?? "default"]
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-lg shadow-sm">
                      - {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}

                <div className="border-t-4 border-dashed border-slate-200 my-6" />

                <div className="flex justify-between items-center px-4">
                  <span className="text-lg md:text-xl font-black text-slate-900">
                    현재 모아온 총 할인율 🎉
                  </span>
                  <span className="text-2xl md:text-3xl font-black text-blue-600 drop-shadow-sm">
                    {formatPercent(bill.totalDiscountRate)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline px-4 py-6 bg-slate-900 rounded-[32px] mt-4 gap-1 shadow-2xl">
                  <span className="text-lg font-black text-white px-4">
                    최종 갱신 시 예상결제액
                  </span>
                  <span className="text-3xl md:text-4xl font-black text-[#FEE500] px-4 tracking-tight">
                    {formatCurrency(bill.finalPremium)}
                  </span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-slate-50/50 rounded-2xl flex justify-center">
                <p className="text-[11px] text-slate-400 font-bold text-center leading-relaxed">
                  * 위 금액은 주행 데이터를 분석해 산출한 예상 마법 금액입니다!<br/> 실제 갱신 시점에 따라 요정의 장난으로 변동될 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
