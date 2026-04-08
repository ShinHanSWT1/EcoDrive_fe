import { ExternalLink, HelpCircle, Info, X, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { InsuranceCompany, InsuranceCoverage } from "../insurance.types";
import { formatCurrency, formatPercent } from "../../../shared/lib/format";
import { getProductCoverages } from "../insurance.api";

type InsuranceCompanyListProps = {
  companies: InsuranceCompany[];
  safetyScore: number | null;
};

export default function InsuranceCompanyList({
  companies,
  safetyScore,
}: InsuranceCompanyListProps) {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<InsuranceCompany | null>(null);
  const [activeModalPlan, setActiveModalPlan] = useState<'BASIC' | 'STANDARD' | 'PREMIUM'>('BASIC');
  const [coverages, setCoverages] = useState<InsuranceCoverage[]>([]);
  const [isLoadingCoverages, setIsLoadingCoverages] = useState(false);

  useEffect(() => {
    if (selectedCompany) {
      setIsLoadingCoverages(true);
      setActiveModalPlan('BASIC'); // 모달 열릴 때 기본형 우선 선택
      getProductCoverages(selectedCompany.id)
        .then(setCoverages)
        .finally(() => setIsLoadingCoverages(false));
    } else {
      setCoverages([]);
    }
  }, [selectedCompany]);

  const PLAN_RANK = { BASIC: 0, STANDARD: 1, PREMIUM: 2 };

  const handleApplyNavigation = () => {
    if (!selectedCompany) return;
    navigate(`/insurance/apply?productId=${selectedCompany.id}&plan=${activeModalPlan}`);
  };

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">보험사별 예상 혜택 비교</h3>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <HelpCircle size={14} /> {safetyScore != null ? `내 점수 기준 (${safetyScore}점)` : '주행 점수 없음'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companies.map((company) => (
          <motion.div
            key={company.name}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedCompany(company)}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-blue-300 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-600">
                  {company.logo}
                </div>

                <div>
                  <div className="font-bold">{company.name}</div>
                  <div className="flex gap-1 mt-1">
                    {company.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">
                  최대 할인율
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {formatPercent(company.discountRate)}
                </div>
              </div>
            </div>

            <div className="mb-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
              <p className="text-[11px] text-blue-700 font-bold flex items-center gap-1.5">
                <Info size={12} /> {company.reason}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  다음 갱신 시 예상 보험료
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-400 line-through decoration-slate-300">
                      {formatCurrency(company.basePremium)}
                    </span>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1 rounded">
                      -{formatPercent(company.discountRate)}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 leading-none mt-0.5">
                    {formatCurrency(company.expectedPremium)}
                  </div>
                </div>
              </div>

              <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all group">
                <ExternalLink size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 상세 모달 */}
      <AnimatePresence>
        {selectedCompany && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCompany(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-xl text-slate-700">
                    {selectedCompany.logo}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900">{selectedCompany.name} 상세 보장</h4>
                    <p className="text-slate-500 text-sm font-bold">에코드라이브 단독 특약 포함</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCompany(null)}
                  className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 text-left">
                {/* 플랜 선택 버튼 */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { type: 'BASIC' as const, label: '기본형', multiplier: 0.8 },
                    { type: 'STANDARD' as const, label: '표준형', multiplier: 1.0 },
                    { type: 'PREMIUM' as const, label: '프리미엄형', multiplier: 1.3 }
                  ].map((p) => {
                    const base = Math.round(selectedCompany.basePremium / 0.8 * p.multiplier);
                    const final = Math.round(base * (1 - selectedCompany.discountRate / 100));
                    const isSelected = activeModalPlan === p.type;
                    
                    return (
                      <button 
                        key={p.type} 
                        onClick={() => setActiveModalPlan(p.type)}
                        className={`p-4 rounded-3xl border-2 text-left transition-all ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-50 shadow-md ring-4 ring-blue-50' 
                            : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className={`text-xs font-bold mb-1 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                          {p.label}
                        </div>
                        <div className="text-lg font-black text-slate-900">{formatCurrency(final)}</div>
                        <div className="text-[10px] text-slate-400 line-through">{formatCurrency(base)}</div>
                      </button>
                    );
                  })}
                </div>

                {/* 보장 항목 리스트 */}
                <div className="space-y-4">
                  <h5 className="font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="text-blue-600" size={20} />
                    {activeModalPlan === 'BASIC' ? '기본형' : activeModalPlan === 'STANDARD' ? '표준형' : '프리미엄형'} 보장 내역
                  </h5>
                  
                  {isLoadingCoverages ? (
                    <div className="py-12 text-center text-slate-400 font-bold">보장 내역을 불러오는 중...</div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-3xl overflow-hidden bg-white">
                      {coverages.map((cov) => {
                        const isIncluded = PLAN_RANK[activeModalPlan] >= PLAN_RANK[cov.planType as keyof typeof PLAN_RANK];
                        
                        return (
                          <div 
                            key={cov.id} 
                            className={`p-4 flex justify-between items-center transition-all ${
                              isIncluded ? 'bg-white' : 'bg-slate-50/50 opacity-40 grayscale'
                            }`}
                          >
                            <div>
                              <div className={`text-[10px] font-bold mb-0.5 ${isIncluded ? 'text-blue-600' : 'text-slate-400'}`}>
                                {cov.category}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${isIncluded ? 'text-slate-800' : 'text-slate-400'}`}>
                                  {cov.coverageName}
                                </span>
                                {!isIncluded && (
                                  <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-1.5 rounded">미포함</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm font-black ${isIncluded ? 'text-slate-900' : 'text-slate-400'}`}>
                                {cov.coverageAmount >= 100000000 
                                  ? `${(cov.coverageAmount / 100000000).toLocaleString()}억원`
                                  : cov.coverageAmount === 0 ? '무제한' : formatCurrency(cov.coverageAmount)}
                              </div>
                              {isIncluded ? (
                                <div className="text-[10px] font-bold text-green-500">포함 항목</div>
                              ) : (
                                <div className="text-[10px] font-bold text-blue-600 uppercase">
                                  {cov.planType} 이상 전용
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 bg-slate-50 flex gap-4">
                <button 
                  onClick={() => setSelectedCompany(null)}
                  className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  닫기
                </button>
                <button 
                  onClick={handleApplyNavigation}
                  className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  보험 가입하기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
