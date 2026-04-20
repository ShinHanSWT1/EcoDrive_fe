import { ExternalLink, HelpCircle, Info, X, ShieldCheck, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { InsuranceCompany, InsuranceCoverage } from "../insurance.types";
import { formatCurrency, formatPercent } from "../../../shared/lib/format";
import { getProductCoverages } from "../insurance.api";
import { PLAN_RANK } from "../insurance.constants";

type InsuranceCompanyListProps = {
 companies: InsuranceCompany[];
 safetyScore: number | null;
 selectedUserVehicleId: number | null;
};

export default function InsuranceCompanyList({
 companies, safetyScore, selectedUserVehicleId,
}: InsuranceCompanyListProps) {
 const navigate = useNavigate();
 const [selectedCompany, setSelectedCompany] = useState<InsuranceCompany | null>(null);
 const [activeModalPlan, setActiveModalPlan] = useState<'BASIC' | 'STANDARD' | 'PREMIUM'>('BASIC');
 const [coverages, setCoverages] = useState<InsuranceCoverage[]>([]);
 const [isLoadingCoverages, setIsLoadingCoverages] = useState(false);
 const [coverageError, setCoverageError] = useState(false);

 useEffect(() => {
 if (selectedCompany) {
 setIsLoadingCoverages(true);
 setCoverageError(false);
 setActiveModalPlan('BASIC');
 getProductCoverages(selectedCompany.id)
 .then(setCoverages)
 .catch(() => { setCoverages([]); setCoverageError(true); })
 .finally(() => setIsLoadingCoverages(false));
 } else {
 setCoverages([]); setCoverageError(false);
 }
 }, [selectedCompany]);

 const handleApplyNavigation = () => {
 if (!selectedCompany) return;
 const query = new URLSearchParams({
 productId: String(selectedCompany.id),
 plan: activeModalPlan,
 });
 if (selectedUserVehicleId != null) query.set("userVehicleId", String(selectedUserVehicleId));
 navigate(`/insurance/apply?${query.toString()}`);
 };

 return (
 <section className="space-y-6 pt-8">
 <div className="flex justify-between items-center">
 <h3 className="font-black text-2xl flex items-center gap-2">
 <Sparkles className="text-[#A0C878]" fill="#A0C878" />
 마법같은 보험사 혜택 비교
 </h3>
 <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
 <HelpCircle size={16} /> {safetyScore != null ? `나의 대단한 점수 (${safetyScore}점)` : '점수 없음'}
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {companies.map((company, index) => (
 <motion.div
 key={company.name}
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.1, type: "spring", bounce: 0.4 }}
 whileHover={{ y: -8, rotate: index % 2 === 0 ? -1 : 1 }}
 onClick={() => setSelectedCompany(company)}
 className="bg-white p-8 rounded-[40px] flex flex-col justify-between cursor-pointer border-[0.5px] border-transparent hover:border-blue-100 transition-colors group relative overflow-hidden"
 >
 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
 
 <div className="flex justify-between items-start mb-6 relative z-10">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 bg-slate-50 rounded-[20px] flex items-center justify-center font-black text-2xl text-slate-700 group-hover:scale-110 transition-transform">
 {company.logo}
 </div>
 <div>
 <div className="font-black text-lg text-slate-900">{company.name}</div>
 <div className="flex flex-wrap gap-1.5 mt-1.5">
 {company.tags.map((tag) => (
 <span key={tag} className="text-[10px] font-bold bg-[#EFF6FF] text-blue-600 px-2 py-1 rounded-xl">
 #{tag}
 </span>
 ))}
 </div>
 </div>
 </div>

 <div className="text-right">
 <div className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mb-0.5">
 최대 꿀 할인율
 </div>
 <div className="text-2xl font-black text-blue-600 drop-">
 {formatPercent(company.discountRate)}
 </div>
 </div>
 </div>

 <div className="mb-6 p-4 bg-[#F8FAFC] rounded-3xl border-[0.5px] border-white flex items-center gap-2 relative z-10">
 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
 <Info size={16} className="text-blue-600" />
 </div>
 <p className="text-xs text-slate-600 font-bold leading-relaxed">
 {company.reason}
 </p>
 </div>

 <div className="pt-6 border-t-2 border-dashed border-slate-100 flex items-center justify-between relative z-10">
 <div className="space-y-1">
 <div className="text-[11px] font-black text-slate-400 uppercase tracking-tight">
 다음 갱신 예상가
 </div>
 <div className="flex flex-col">
 <div className="flex items-center gap-2">
 <span className="text-xs font-bold text-slate-300 line-through">
 {formatCurrency(company.basePremium)}
 </span>
 <span className="text-[10px] font-black text-white bg-red-500 px-1.5 py-0.5 rounded-lg ">
 -{formatPercent(company.discountRate)}
 </span>
 </div>
 <div className="text-3xl font-black text-slate-900 leading-none mt-1 group-hover:text-blue-600 transition-colors">
 {formatCurrency(company.expectedPremium)}
 </div>
 </div>
 </div>

 <button className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 rounded-[20px] transition-colors group-hover:scale-110">
 <ExternalLink size={20} />
 </button>
 </div>
 </motion.div>
 ))}
 </div>

 <AnimatePresence>
 {selectedCompany && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setSelectedCompany(null)}
 className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
 />
 <motion.div
 initial={{ opacity: 0, scale: 0.9, y: 40 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.9, y: 40 }}
 transition={{ type: "spring", damping: 25, stiffness: 300 }}
 className="relative w-full max-w-2xl bg-white rounded-[50px] overflow-hidden flex flex-col max-h-[85vh] border-[0.5px] border-slate-100"
 >
 <div className="p-8 pb-6 border-b-2 border-dashed border-slate-200 flex justify-between items-center bg-white relative z-10">
 <div className="flex items-center gap-4">
 <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center font-black text-3xl text-slate-700">
 {selectedCompany.logo}
 </div>
 <div>
 <h4 className="text-2xl font-black text-slate-900 tracking-tight">{selectedCompany.name} 상세 보장</h4>
 <p className="text-blue-600 text-sm font-extrabold flex items-center gap-1 mt-1">
 <Sparkles size={14} /> 에코드라이브 단독 특약 포함!
 </p>
 </div>
 </div>
 <button 
 onClick={() => setSelectedCompany(null)}
 className="w-12 h-12 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors flex items-center justify-center"
 >
 <X size={24} />
 </button>
 </div>

 <div className="flex-1 overflow-y-auto p-8 space-y-10 text-left bg-[#F8FAFC]">
 <div className="grid grid-cols-3 gap-4">
 {[
 { type: 'BASIC' as const, label: '기본형 🐢', multiplier: 0.8 },
 { type: 'STANDARD' as const, label: '표준형 🚙', multiplier: 1.0 },
 { type: 'PREMIUM' as const, label: '프리미엄 🚀', multiplier: 1.3 }
 ].map((p) => {
 const base = Math.round(selectedCompany.basePremium / 0.8 * p.multiplier);
 const final = Math.round(base * (1 - selectedCompany.discountRate / 100));
 const isSelected = activeModalPlan === p.type;
 
 return (
 <motion.button 
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 key={p.type} 
 onClick={() => setActiveModalPlan(p.type)}
 className={`p-5 rounded-[32px] border-[0.5px] text-left transition-all ${
 isSelected 
 ? 'border-blue-600 bg-white ring-8 ring-blue-100/50 scale-105 z-10' 
 : 'border-slate-100 bg-white hover:border-slate-200 opacity-60 hover:opacity-100'
 }`}
 >
 <div className={`text-sm font-black mb-1 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
 {p.label}
 </div>
 <div className={`text-xl font-black tracking-tight ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
 {formatCurrency(final)}
 </div>
 <div className="text-xs text-slate-400 font-bold line-through mt-1">{formatCurrency(base)}</div>
 </motion.button>
 );
 })}
 </div>

 <div className="space-y-4">
 <h5 className="font-black text-xl text-slate-900 flex items-center gap-2">
 <ShieldCheck className="text-[#A0C878]" fill="#143D60" size={28} />
 {activeModalPlan === 'BASIC' ? '기본형' : activeModalPlan === 'STANDARD' ? '표준형' : '프리미엄형'} 보장 내역 팡팡!
 </h5>
 
 {isLoadingCoverages ? (
 <div className="py-12 text-center text-blue-400 font-black animate-pulse">보장 내역 요정 부르는 중... ✨</div>
 ) : coverageError ? (
 <div className="py-12 text-center text-red-500 font-black">앗! 데이터를 못 가져왔어요. 잠시 후 다시 부탁드려요!</div>
 ) : (
 <div className="space-y-3">
 {coverages.map((cov, i) => {
 const isIncluded = PLAN_RANK[activeModalPlan] >= PLAN_RANK[cov.planType as keyof typeof PLAN_RANK];
 
 return (
 <motion.div 
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: i * 0.05 }}
 key={cov.id} 
 className={`p-5 rounded-[24px] flex justify-between items-center transition-all border-[0.5px] ${
 isIncluded ? 'bg-white border-transparent ' : 'bg-slate-100/50 border-transparent opacity-50 grayscale'
 }`}
 >
 <div>
 <div className={`text-xs font-black mb-1 ${isIncluded ? 'text-blue-500' : 'text-slate-400'}`}>
 {cov.category}
 </div>
 <div className="flex items-center gap-2">
 <span className={`text-base font-black ${isIncluded ? 'text-slate-900' : 'text-slate-400'}`}>
 {cov.coverageName}
 </span>
 </div>
 </div>
 <div className="text-right">
 <div className={`text-lg font-black tracking-tight ${isIncluded ? 'text-slate-900' : 'text-slate-400'}`}>
 {cov.coverageAmount >= 100000000 
 ? `${(cov.coverageAmount / 100000000).toLocaleString()}억원`
 : cov.coverageAmount === 0 ? '무제한 🌟' : formatCurrency(cov.coverageAmount)}
 </div>
 {isIncluded ? (
 <div className="text-[11px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">포함됨</div>
 ) : (
 <div className="text-[11px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-1 uppercase">
 {cov.planType} 이상 전용
 </div>
 )}
 </div>
 </motion.div>
 );
 })}
 </div>
 )}
 </div>
 </div>

 <div className="p-6 bg-white flex gap-4 border-t-2 border-dashed border-slate-200">
 <button 
 onClick={() => setSelectedCompany(null)}
 className="flex-1 py-5 bg-slate-100 rounded-[28px] font-black text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all text-lg"
 >
 닫기
 </button>
 <button 
 onClick={handleApplyNavigation}
 className="flex-[2] py-5 bg-blue-600 text-white rounded-[28px] font-black hover:bg-blue-700 hover:-translate-y-1 transition-all text-lg"
 >
 할인 듬뿍 받고 가입하기!
 </button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 </section>
 );
}
