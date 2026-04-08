import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronUp, ChevronDown, RotateCcw, ShieldCheck, Check } from "lucide-react";
import { formatCurrency } from "../shared/lib/format";
import { api } from "../shared/api/client";
import { getInsuranceFactors, getProductCoverages, createInsuranceContract } from "../features/insurance/insurance.api";
import type { InsuranceCoverage } from "../features/insurance/insurance.types";

export default function InsuranceConfirmPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const productId = Number(searchParams.get("productId"));
  const initialPlan = (searchParams.get("plan") as "BASIC" | "STANDARD" | "PREMIUM") || "BASIC";
  
  const applicationData = location.state || {};
  
  const [productInfo, setProductInfo] = useState<any>(null);
  const [factors, setFactors] = useState<any>(null);
  const [coverages, setCoverages] = useState<InsuranceCoverage[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<"BASIC" | "STANDARD" | "PREMIUM">(initialPlan);
  const [selectedCoverageIds, setSelectedCoverageIds] = useState<number[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const PLAN_RANK = { BASIC: 0, STANDARD: 1, PREMIUM: 2 };
  const PLAN_MULTIPLIERS = { BASIC: 0.8, STANDARD: 1.0, PREMIUM: 1.3 };
  const PLAN_LABELS = {
    BASIC: { title: "실속", icon: "➕", desc: "운전자 3대 필수 비용은 기본" },
    STANDARD: { title: "표준", icon: "🏆", desc: "자동차 사고로 다쳤을 때 걱정없게" },
    PREMIUM: { title: "고급", icon: "🛡️", desc: "사고 후 치료와 재활까지 꼼꼼하게", badge: "60개 보장" }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [productRes, factorData, coverageList] = await Promise.all([
          api.get(`/insurance/products/${productId}`),
          getInsuranceFactors(),
          getProductCoverages(productId)
        ]);
        setProductInfo(productRes.data.data);
        setFactors(factorData);
        setCoverages(coverageList);
        
        const categories = Array.from(new Set(coverageList.map(c => c.category)));
        setExpandedCategories(categories);
        
        const initialSelected = coverageList
          .filter(c => PLAN_RANK[initialPlan] >= PLAN_RANK[c.planType as keyof typeof PLAN_RANK])
          .map(c => c.id);
        setSelectedCoverageIds(initialSelected);
        
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (productId) fetchData();
  }, [productId, initialPlan]);

  const handlePlanChange = (type: "BASIC" | "STANDARD" | "PREMIUM") => {
    setSelectedPlan(type);
    const updatedSelected = coverages
      .filter(c => PLAN_RANK[type] >= PLAN_RANK[c.planType as keyof typeof PLAN_RANK])
      .map(c => c.id);
    setSelectedCoverageIds(updatedSelected);
  };

  const toggleCoverage = (cov: InsuranceCoverage) => {
    // 현재 선택된 플랜 등급보다 높은 특약은 선택 불가
    if (PLAN_RANK[selectedPlan] < PLAN_RANK[cov.planType as keyof typeof PLAN_RANK]) {
      alert(`${PLAN_LABELS[cov.planType as keyof typeof PLAN_LABELS].title} 플랜 이상에서만 선택 가능한 특약입니다.`);
      return;
    }
    
    setSelectedCoverageIds(prev => 
      prev.includes(cov.id) ? prev.filter(item => item !== cov.id) : [...prev, cov.id]
    );
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const calculatePremiums = (type: "BASIC" | "STANDARD" | "PREMIUM") => {
    const base = productInfo?.baseAmount || 600000;
    const ageFactor = factors?.calc?.ageFactor || 1.0;
    const expFactor = factors?.calc?.experienceFactor || 1.0;
    const scoreDiscount = factors?.calc?.scoreDiscountRate || 0;
    const planMultiplier = PLAN_MULTIPLIERS[type];

    const basePremium = Math.round(base * ageFactor * expFactor * planMultiplier);
    const finalPremium = Math.round(basePremium * (1 - scoreDiscount));
    const discountAmount = basePremium - finalPremium;
    
    return { basePremium, finalPremium, discountAmount };
  };

  const handleFinalApply = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await createInsuranceContract({
        insuranceProductId: productId,
        phoneNumber: applicationData.phoneNumber || "010-0000-0000",
        address: applicationData.address || "정보 없음",
        contractPeriod: 12,
        planType: selectedPlan,
        selectedCoverageIds,
      });
      alert("보험 가입이 완료되었습니다!");
      navigate("/insurance");
    } catch (error) {
      alert("가입 처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center font-bold">로딩 중...</div>;

  const currentPrices = calculatePremiums(selectedPlan);
  const groupedCoverages = coverages.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, InsuranceCoverage[]>);

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-32">
      <div className="max-w-5xl mx-auto py-12 px-8">
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-400 hover:text-slate-600 font-medium">
            <ChevronLeft size={20} /> 뒤로가기
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-100">
              안전점수 {factors?.safetyScore ?? 0}점
            </span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <ShieldCheck size={14} /> 안전운전 할인 {formatCurrency(currentPrices.discountAmount)} 절약 중
            </span>
          </div>
        </div>

        <header className="mb-12 text-left">
          <div className="text-[#FF5C35] font-bold text-base mb-2">보험료 확인</div>
          <h1 className="text-[32px] font-bold text-slate-900 leading-tight">
            자동차보다 중요한 운전자,<br />어디까지 보장받아야 할까요?
          </h1>
        </header>

        {/* 플랜 선택 카드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-12">
          {(["BASIC", "STANDARD", "PREMIUM"] as const).map((type) => {
            const isSelected = selectedPlan === type;
            const { basePremium, finalPremium } = calculatePremiums(type);
            
            return (
              <div key={type} onClick={() => handlePlanChange(type)} className={`cursor-pointer transition-all duration-300 ${isSelected ? "lg:scale-105 z-10" : "opacity-60"}`}>
                <div className={`bg-white rounded-[32px] border-2 p-8 flex flex-col ${isSelected ? "border-[#FF5C35] shadow-xl shadow-[#FF5C35]/10" : "border-slate-100"}`}>
                  <div className={`text-sm font-bold mb-2 ${isSelected ? "text-[#FF5C35]" : "text-slate-400"}`}>{PLAN_LABELS[type].title}</div>
                  <div className="text-xs text-slate-400 font-bold line-through mb-1">{formatCurrency(basePremium)}</div>
                  <div className="text-2xl font-black text-slate-900">{formatCurrency(finalPremium)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 혜택 배너 */}
        <div className="space-y-3 mb-12">
          <div className="bg-[#FFF4F2] p-5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#FF5C35] rounded-full flex items-center justify-center text-white font-bold">%</div>
              <div className="text-left font-bold text-slate-700">
                {productInfo?.companyName} 가입 고객 <span className="text-[#FF5C35]">안전점수 기반 {formatCurrency(currentPrices.discountAmount)} 할인</span>
              </div>
            </div>
          </div>
        </div>

        {/* 특약 선택 리스트 */}
        <div className="space-y-6">
          {Object.entries(groupedCoverages).map(([category, items]) => (
            <div key={category} className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
              <button onClick={() => toggleCategory(category)} className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <h4 className="text-lg font-bold text-slate-900">{category}</h4>
                {expandedCategories.includes(category) ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
              
              {expandedCategories.includes(category) && (
                <div className="px-8 pb-8 divide-y divide-slate-50">
                  {items.map((cov) => {
                    const isSelectable = PLAN_RANK[selectedPlan] >= PLAN_RANK[cov.planType as keyof typeof PLAN_RANK];
                    const isSelected = selectedCoverageIds.includes(cov.id);
                    
                    return (
                      <div key={cov.id} className={`py-5 flex items-center justify-between transition-all ${!isSelectable ? "opacity-30" : ""}`}>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => toggleCoverage(cov)}
                            className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                              isSelected ? "bg-[#FF5C35]" : "border-2 border-slate-200"
                            } ${!isSelectable ? "cursor-not-allowed" : "hover:border-[#FF5C35]"}`}
                          >
                            {isSelected && <Check size={16} className="text-white" strokeWidth={3} />}
                          </button>
                          <div className="flex flex-col text-left">
                            <div className="flex items-center gap-2">
                              <span className={`text-[15px] font-bold ${isSelected ? "text-slate-900" : "text-slate-400"}`}>
                                {cov.coverageName}
                              </span>
                              {!isSelectable && <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">{cov.planType} 전용</span>}
                            </div>
                          </div>
                        </div>
                        <div className={`text-[15px] font-bold ${isSelected ? "text-[#FF5C35]" : "text-slate-300"}`}>
                          {isSelected ? (cov.coverageAmount >= 100000000 ? `${(cov.coverageAmount / 100000000).toLocaleString()}억원` : `${(cov.coverageAmount / 10000).toLocaleString()}만원`) : "미가입"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 하단 고정 바 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="text-left flex items-center gap-6">
              <div>
                <div className="text-xs font-bold text-slate-400 mb-1">{productInfo?.companyName} {PLAN_LABELS[selectedPlan].title} 가입</div>
                <div className="text-2xl font-black text-slate-900">{formatCurrency(currentPrices.finalPremium)}</div>
              </div>
              <div className="h-10 w-[1px] bg-slate-100" />
              <div className="text-left">
                <div className="text-[10px] font-bold text-blue-500 mb-0.5">안전운전 할인 혜택</div>
                <div className="text-lg font-bold text-blue-600">-{formatCurrency(currentPrices.discountAmount)}</div>
              </div>
            </div>
            <button 
              onClick={handleFinalApply}
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              {isSubmitting ? "처리 중..." : "최종 가입 완료하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
