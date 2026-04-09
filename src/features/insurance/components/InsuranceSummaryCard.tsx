import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
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
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
        <div>
          <div className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">
            현재 가입 보험
          </div>
          <div className="text-xl font-bold">{currentSummary.companyName}</div>
        </div>

        <div className="text-right">
          <div className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">
            갱신일
          </div>
          <div className="text-xl font-bold">
            D-{currentSummary.renewalDday}
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-500 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" />
            할인 조건 충족 현황
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">
                안전 점수 80점 이상
              </span>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                currentSummary.safetyScore == null ? 'text-slate-400 bg-slate-100'
                  : currentSummary.safetyScore >= 80 ? 'text-blue-600 bg-blue-50'
                  : 'text-red-600 bg-red-50'
              }`}>
                {currentSummary.safetyScore == null ? '주행 점수 없음'
                  : currentSummary.safetyScore >= 80 ? `충족 (${currentSummary.safetyScore}점)`
                  : `미충족 (${currentSummary.safetyScore}점)`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">
                연간 주행 1.5만km 이하
              </span>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                currentSummary.annualMileageKm === 0 
                  ? 'text-slate-400 bg-slate-100' 
                  : currentSummary.annualMileageKm <= 15000 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-red-600 bg-red-50'
              }`}>
                {currentSummary.annualMileageKm === 0 
                  ? '주행 기록 없음' 
                  : currentSummary.annualMileageKm <= 15000 
                    ? `충족 (${formatMileageKm(currentSummary.annualMileageKm)})` 
                    : `미충족 (${formatMileageKm(currentSummary.annualMileageKm)})`
                }
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-slate-50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="text-sm text-slate-500 font-medium mb-1">
              다음 갱신 시 예상 보험료
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {formatCurrency(currentSummary.expectedPremium)}
              </span>
              <span className="text-sm font-bold text-blue-600">
                (-{formatPercent(currentSummary.expectedDiscountRate)})
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              현재까지 누적 예상 절감액{" "}
              {formatCurrency(currentSummary.totalExpectedSavings)}
            </p>
          </div>

          <button
            onClick={onToggleBill}
            className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            예상 보험료 산출서 보기
            {showBill ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      <InsuranceBillPanel bill={bill} visible={showBill} />
    </div>
  );
}
