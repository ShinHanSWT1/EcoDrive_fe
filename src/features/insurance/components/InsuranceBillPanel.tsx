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
          className="overflow-hidden border-t border-slate-100 bg-slate-50/50"
        >
          <div className="p-4 md:p-8 max-w-2xl mx-auto">
            <div className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-xl relative">
              <div className="absolute top-0 left-0 right-0 h-2 bg-blue-600 rounded-t-3xl" />

              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div>
                  <h5 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2">
                    <Receipt className="text-blue-600 shrink-0" />
                    다음 갱신 시 예상 보험료 산출서
                  </h5>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-1 font-bold">
                    발행일: {bill.issuedAt}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    계약번호
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {bill.contractNumber}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-1">
                  <span className="text-slate-500 font-medium text-sm md:text-base">
                    {bill.productNameLabel || "기본 보험료"}
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(bill.basePremium)}
                  </span>
                </div>

                <div className="h-px bg-slate-100" />

                {bill.discountItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium text-sm md:text-base">
                        {item.label}
                      </span>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            badgeToneClassMap[item.tone ?? "default"]
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <span className="font-bold text-blue-600">
                      - {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}

                <div className="h-px bg-slate-200" />

                <div className="flex justify-between items-center pt-4">
                  <span className="text-base md:text-lg font-black text-slate-900">
                    현재 예상 할인율
                  </span>
                  <span className="text-xl md:text-2xl font-black text-blue-600">
                    {formatPercent(bill.totalDiscountRate)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline pb-2 gap-1">
                  <span className="text-base md:text-lg font-black text-slate-900">
                    다음 갱신 시 예상 보험료
                  </span>
                  <span className="text-2xl md:text-3xl font-black text-slate-900">
                    {formatCurrency(bill.finalPremium)}
                  </span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-[10px] text-slate-400 leading-relaxed text-center font-medium">
                  * 위 금액은 현재 주행 데이터를 기반으로 산출된 예상 금액이며,
                  실제 보험사 갱신 시점에 따라 변동될 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
