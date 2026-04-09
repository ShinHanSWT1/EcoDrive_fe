import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../shared/lib/utils';
import { PLAN_INFO, type PlanType } from '../insurance/insurance.constants';

interface InsuranceStepProps {
  insuranceCompanyName: string;
  insuranceCompanies: string[];
  selectedPlan: PlanType;
  productName: string;
  productBaseAmount: number;
  insuranceStartedAt: string;
  age: number | '';
  isSubmitting: boolean;
  errorMessage: string | null;
  onInsuranceCompanyChange: (value: string) => void;
  onPlanChange: (value: PlanType) => void;
  onInsuranceStartedAtChange: (value: string) => void;
  onAgeChange: (value: number | '') => void;
  onPrevStep: () => void;
  onSubmit: () => void;
}

export default function InsuranceStep({
  insuranceCompanyName,
  insuranceCompanies,
  selectedPlan,
  productName,
  productBaseAmount,
  insuranceStartedAt,
  age,
  isSubmitting,
  errorMessage,
  onInsuranceCompanyChange,
  onPlanChange,
  onInsuranceStartedAtChange,
  onAgeChange,
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
        {/* 보험사 선택 */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">보험사</label>
          <select
            value={insuranceCompanyName}
            onChange={(e) => onInsuranceCompanyChange(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none"
          >
            {insuranceCompanies.map((company) => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>

        {/* 보험 상품 표시 */}
        {productName && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">보험 상품</label>
            <div className="w-full bg-slate-50 rounded-2xl py-4 px-6 text-sm font-bold text-slate-700">
              {productName}
            </div>
          </div>
        )}

        {/* 플랜 등급 선택 */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">플랜 등급</label>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(PLAN_INFO) as PlanType[]).map((plan) => {
              const info = PLAN_INFO[plan];
              const price = productBaseAmount > 0
                ? Math.round(productBaseAmount * info.multiplier).toLocaleString()
                : '--';
              const isSelected = selectedPlan === plan;
              return (
                <button
                  key={plan}
                  type="button"
                  onClick={() => onPlanChange(plan)}
                  className={cn(
                    'rounded-2xl border-2 p-4 text-left transition-all',
                    isSelected ? info.color + ' border-opacity-100' : 'border-slate-200 bg-white hover:bg-slate-50',
                    isSelected && plan === 'STANDARD' && 'ring-2 ring-blue-400 ring-offset-1'
                  )}
                >
                  <div className={cn('text-sm font-bold mb-1', isSelected ? 'text-slate-900' : 'text-slate-600')}>
                    {info.label}
                  </div>
                  <div className="text-xs text-slate-500 mb-2">{info.desc}</div>
                  <div className={cn('text-sm font-bold', isSelected ? 'text-blue-600' : 'text-slate-500')}>
                    {price}원
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 가입일 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">보험 가입일</label>
            <input
              type="date"
              value={insuranceStartedAt}
              onChange={(e) => onInsuranceStartedAtChange(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>

          {/* 나이 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">나이</label>
            <input
              type="number"
              placeholder="만 나이"
              value={age}
              onKeyDown={(e) => {
                if (['.', 'e', 'E', '+', '-'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  onAgeChange('');
                } else {
                  const num = parseInt(val, 10);
                  if (!isNaN(num)) onAgeChange(num);
                }
              }}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
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
