import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface InsuranceStepProps {
  insuranceCompanyName: string;
  annualPremium: string;
  insuranceStartedAt: string;
  insuranceCompanies: string[];
  isSubmitting: boolean;
  errorMessage: string | null;
  onInsuranceCompanyChange: (value: string) => void;
  onAnnualPremiumChange: (value: string) => void;
  onInsuranceStartedAtChange: (value: string) => void;
  onPrevStep: () => void;
  onSubmit: () => void;
}

export default function InsuranceStep({
  insuranceCompanyName,
  annualPremium,
  insuranceStartedAt,
  insuranceCompanies,
  isSubmitting,
  errorMessage,
  onInsuranceCompanyChange,
  onAnnualPremiumChange,
  onInsuranceStartedAtChange,
  onPrevStep,
  onSubmit,
}: InsuranceStepProps) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-[40px] border border-slate-200 shadow-xl p-8 md:p-12"
    >
      <div className="mb-8">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <ShieldCheck size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">현재 보험 정보를 입력해주세요</h2>
        <p className="text-slate-500">기존 보험료 대비 절감액을 계산해드립니다.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Insurance Company</label>
            <select
              value={insuranceCompanyName}
              onChange={(event) => onInsuranceCompanyChange(event.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none"
            >
              {insuranceCompanies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Annual Premium</label>
            <input
              type="text"
              placeholder="1200000"
              value={annualPremium}
              onChange={(event) => onAnnualPremiumChange(event.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Insurance Start Date</label>
          <input
            type="date"
            value={insuranceStartedAt}
            onChange={(event) => onInsuranceStartedAtChange(event.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>

        {errorMessage && (
          <p className="text-sm font-medium text-red-500">{errorMessage}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onPrevStep}
            disabled={isSubmitting}
            className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            이전
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            {isSubmitting ? '저장 중...' : '분석 시작하기'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
