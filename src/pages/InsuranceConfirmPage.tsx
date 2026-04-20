import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Check, ChevronDown, ChevronLeft, ChevronUp, RotateCcw, ShieldCheck } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { formatCurrency } from "../shared/lib/format";
import { api } from "../shared/api/client";
import {
 cancelInsuranceContract,
 getMyInsurances,
 getProductCoverages,
 prepareInsuranceCheckout,
 type InsuranceCheckoutPrepareRequest,
} from "../features/insurance/insurance.api";
import { PLAN_LABELS, PLAN_MULTIPLIERS, PLAN_RANK } from "../features/insurance/insurance.constants";
import type { InsuranceCoverage } from "../features/insurance/insurance.types";

type PlanType = "BASIC" | "STANDARD" | "PREMIUM";

type ApplicationData = {
 userVehicleId?: number;
 phoneNumber?: string;
 email?: string;
 address?: string;
};

type PaymentDoneMessage = {
 type: "ECODRIVE_PAYMENT_DONE";
 flow: "insurance" | "coupon";
};

export default function InsuranceConfirmPage() {
 const [searchParams] = useSearchParams();
 const location = useLocation();
 const navigate = useNavigate();

 const productId = Number(searchParams.get("productId"));
 const initialPlan = (searchParams.get("plan") as PlanType) || "BASIC";
 const applicationData = (location.state || {}) as ApplicationData;

 type PremiumEstimate = {
 planAdjustedBase: number;
 ageFactor: number;
 experienceFactor: number;
 adjustedBase: number;
 discountRate: number;
 discountAmount: number;
 finalAmount: number;
 };

 const [productInfo, setProductInfo] = useState<any>(null);
 const [estimates, setEstimates] = useState<Partial<Record<PlanType, PremiumEstimate>>>({});
 const [safetyScore, setSafetyScore] = useState<number | null>(null);
 const [coverages, setCoverages] = useState<InsuranceCoverage[]>([]);
 const [selectedPlan, setSelectedPlan] = useState<PlanType>(initialPlan);
 const [selectedCoverageIds, setSelectedCoverageIds] = useState<number[]>([]);
 const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [isError, setIsError] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
 const [isSigned, setIsSigned] = useState(false);
 const [nickname, setNickname] = useState("");
 const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
 const [cancelTargetContractId, setCancelTargetContractId] = useState<number | null>(null);
 const [pendingCheckoutPayload, setPendingCheckoutPayload] = useState<InsuranceCheckoutPrepareRequest | null>(null);
 const [isCancelSubmitting, setIsCancelSubmitting] = useState(false);
 const [isCheckoutPopupOpen, setIsCheckoutPopupOpen] = useState(false);

 const signatureRef = useRef<SignatureCanvas>(null);

 const extractErrorInfo = (error: unknown): { code: string | null; status: number | null; message: string | null } => {
 const response = (error as any)?.response;
 const maybeCode = response?.data?.code;
 const maybeStatus = response?.status;
 const maybeMessage = response?.data?.message || (error as any)?.message || null;

 return {
 code: typeof maybeCode === "string" ? maybeCode : null,
 status: typeof maybeStatus === "number" ? maybeStatus : null,
 message: typeof maybeMessage === "string" ? maybeMessage : null,
 };
 };

 // 해당 차량의 활성 보험 계약 ID 조회 (충돌 시 해지 대상 식별용)
 const findActiveContractIdByVehicle = async (vehicleId: number): Promise<number | null> => {
 const insurances = await getMyInsurances();
 const activeInsurance = insurances.find(
 (insurance) => insurance.status === "ACTIVE" && insurance.userVehicleId === vehicleId,
 );
 return activeInsurance?.insuranceContractsId ?? null;
 };

 const prepareAndRedirectCheckout = async (payload: InsuranceCheckoutPrepareRequest) => {
 const prepared = await prepareInsuranceCheckout(payload);
 console.info("[보험 결제] 결제 세션 생성 완료, PAY 결제창으로 이동합니다.", {
 orderId: prepared.orderId,
 insuranceContractId: prepared.insuranceContractId,
 });
 setIsSignatureModalOpen(false);

 const checkoutPopup = window.open(
 prepared.checkoutUrl,
 "EcodrivePayCheckout",
 "width=500,height=820,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes",
 );

 // 팝업 차단 시 기존 동작으로 폴백
 if (!checkoutPopup) {
 alert("팝업이 차단되어 현재 창에서 결제를 진행합니다.");
 window.location.href = prepared.checkoutUrl;
 return;
 }

 checkoutPopup.focus();
 setIsCheckoutPopupOpen(true);
 };

 useEffect(() => {
 async function fetchData() {
 try {
 setIsError(false);
 const [productRes, basicEst, standardEst, premiumEst, coverageList, userRes, scoreRes] =
 await Promise.all([
 api.get(`/insurance/products/${productId}`),
 api.get(`/insurance/products/${productId}/premium-estimate`, { params: { planType: "BASIC", userVehicleId: applicationData.userVehicleId } }),
 api.get(`/insurance/products/${productId}/premium-estimate`, { params: { planType: "STANDARD", userVehicleId: applicationData.userVehicleId } }),
 api.get(`/insurance/products/${productId}/premium-estimate`, { params: { planType: "PREMIUM", userVehicleId: applicationData.userVehicleId } }),
 getProductCoverages(productId),
 api.get("/users/me"),
 api.get("/driving/scores/latest").catch(() => ({ data: { data: { score: null } } })),
 ]);

 if (!coverageList || coverageList.length === 0) {
 throw new Error("보장 내역을 불러올 수 없습니다.");
 }

 setProductInfo(productRes.data.data);
 setEstimates({
 BASIC: basicEst.data.data,
 STANDARD: standardEst.data.data,
 PREMIUM: premiumEst.data.data,
 });
 setSafetyScore(scoreRes.data.data.score ?? null);
 setCoverages(coverageList);
 setNickname(userRes.data.data.nickname || "");

 const categories = Array.from(new Set(coverageList.map((c: InsuranceCoverage) => c.category)));
 setExpandedCategories(categories);

 const initialSelected = coverageList
 .filter((c) => PLAN_RANK[initialPlan] >= PLAN_RANK[c.planType as keyof typeof PLAN_RANK])
 .map((c) => c.id);
 setSelectedCoverageIds(initialSelected);
 } catch (error) {
 console.error("보험 확인 데이터 로딩 실패:", error);
 setIsError(true);
 } finally {
 setIsLoading(false);
 }
 }

 if (productId) {
 fetchData();
 }
 }, [productId, initialPlan]);

 useEffect(() => {
 const handlePaymentDone = (event: MessageEvent<PaymentDoneMessage>) => {
 if (event.origin !== window.location.origin) {
 return;
 }
 if (!event.data || event.data.type !== "ECODRIVE_PAYMENT_DONE") {
 return;
 }
 if (event.data.flow !== "insurance") {
 return;
 }

 console.info("[보험 결제] 팝업 결제 완료 이벤트 수신, 보험 페이지로 이동합니다.");
 navigate("/insurance", { replace: true });
 };

 window.addEventListener("message", handlePaymentDone);
 return () => window.removeEventListener("message", handlePaymentDone);
 }, [navigate]);

 const getEstimate = (type: PlanType) => estimates[type] ?? null;

 const calculatePremiums = (type: PlanType) => {
 const est = getEstimate(type);
 return {
 basePremium: est?.adjustedBase ?? 0,
 finalPremium: est?.finalAmount ?? 0,
 discountAmount: est?.discountAmount ?? 0,
 };
 };

 const getAgeFactorLabel = (factor: number) => {
 if (factor >= 1.29) return "20~25세";
 if (factor >= 1.09) return "26~30세";
 if (factor >= 0.99) return "31~40세";
 return "41세 이상";
 };

 const getExpFactorLabel = (factor: number) => {
 if (factor >= 1.29) return "1년 미만";
 if (factor >= 1.09) return "1~3년";
 return "3년 이상";
 };

 const handlePlanChange = (type: PlanType) => {
 setSelectedPlan(type);
 const updatedSelected = coverages
 .filter((c) => PLAN_RANK[type] >= PLAN_RANK[c.planType as keyof typeof PLAN_RANK])
 .map((c) => c.id);
 setSelectedCoverageIds(updatedSelected);
 };

 const toggleCoverage = (coverage: InsuranceCoverage) => {
 if (PLAN_RANK[selectedPlan] < PLAN_RANK[coverage.planType as keyof typeof PLAN_RANK]) {
 alert(`${PLAN_LABELS[coverage.planType as keyof typeof PLAN_LABELS].title} 플랜 이상에서만 선택 가능합니다.`);
 return;
 }

 setSelectedCoverageIds((prev) =>
 prev.includes(coverage.id) ? prev.filter((item) => item !== coverage.id) : [...prev, coverage.id],
 );
 };

 const toggleCategory = (category: string) => {
 setExpandedCategories((prev) =>
 prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
 );
 };

 const drawWatermark = () => {
 const canvas = signatureRef.current?.getCanvas();
 if (!canvas) return;

 const ctx = canvas.getContext("2d");
 if (!ctx) return;

 ctx.save();
 ctx.translate(canvas.width / 2, canvas.height / 2);
 ctx.rotate(-Math.PI / 6);
 ctx.textAlign = "center";
 ctx.fillStyle = "rgba(180, 180, 180, 0.25)";

 ctx.font = "bold 28px Arial";
 ctx.fillText("EcoDrive 전자계약", 0, -30);

 ctx.font = "bold 20px Arial";
 ctx.fillText(nickname || "계약자", 0, 5);

 ctx.font = "16px Arial";
 ctx.fillText(new Date().toLocaleDateString("ko-KR"), 0, 30);
 ctx.restore();
 };

 const handleOpenSignature = () => {
 setIsSignatureModalOpen(true);
 setIsSigned(false);
 setTimeout(() => drawWatermark(), 100);
 };

 const handleClearSignature = () => {
 signatureRef.current?.clear();
 setIsSigned(false);
 setTimeout(() => drawWatermark(), 50);
 };

 const handleFinalApply = async () => {
 if (isSubmitting) return;
 if (!applicationData.userVehicleId) {
 alert("차량 정보가 누락되었습니다. 보험 상품을 다시 선택해주세요.");
 return;
 }

 setIsSubmitting(true);
 try {
 const signatureImage = signatureRef.current?.toDataURL("image/png");
 const origin = window.location.origin;
 const payload: InsuranceCheckoutPrepareRequest = {
 insuranceProductId: productId,
 userVehicleId: applicationData.userVehicleId,
 phoneNumber: applicationData.phoneNumber || "010-0000-0000",
 address: applicationData.address || "정보 없음",
 contractPeriod: 12,
 planType: selectedPlan,
 selectedCoverageIds,
 signatureImage: signatureImage || "",
 email: applicationData.email || "",
 successUrl: `${origin}/insurance/checkout/success`,
 failUrl: `${origin}/insurance/checkout/fail`,
 };

 // 결제 준비 요청 재시도를 위해 payload 보관
 setPendingCheckoutPayload(payload);
 await prepareAndRedirectCheckout(payload);
 } catch (error) {
 const { code: errorCode, status: errorStatus, message: errorMessage } = extractErrorInfo(error);
 console.warn("[보험 결제] 결제 준비 실패", {
 errorCode,
 errorStatus,
 errorMessage,
 userVehicleId: applicationData.userVehicleId,
 });

 const isActiveInsuranceConflict = errorCode === "INSURANCE_012"
 || (errorStatus === 409 && (errorMessage?.includes("활성 보험") || errorMessage?.includes("이미 가입된 보험")));

 if (isActiveInsuranceConflict && applicationData.userVehicleId) {
 try {
 const activeContractId = await findActiveContractIdByVehicle(applicationData.userVehicleId);
 if (activeContractId) {
 console.info("[보험 결제] 기존 활성 보험 발견, 해지 모달을 노출합니다.", {
 activeContractId,
 userVehicleId: applicationData.userVehicleId,
 });
 setCancelTargetContractId(activeContractId);
 setIsCancelModalOpen(true);
 return;
 }
 } catch (findError) {
 console.error("[보험 결제] 활성 보험 조회 실패", findError);
 }
 }

 alert("가입 처리 중 오류가 발생했습니다.");
 } finally {
 setIsSubmitting(false);
 }
 };

 const handleCancelAndRetry = async () => {
 if (!cancelTargetContractId || !pendingCheckoutPayload) {
 alert("해지 대상 계약 정보가 없습니다. 다시 시도해주세요.");
 return;
 }

 setIsCancelSubmitting(true);
 try {
 console.info("[보험 결제] 기존 보험 해지 요청", { contractId: cancelTargetContractId });
 await cancelInsuranceContract(cancelTargetContractId);
 console.info("[보험 결제] 기존 보험 해지 완료, 결제 준비를 재시도합니다.", {
 contractId: cancelTargetContractId,
 });

 setIsCancelModalOpen(false);
 setCancelTargetContractId(null);
 await prepareAndRedirectCheckout(pendingCheckoutPayload);
 } catch (error) {
 console.error("[보험 결제] 기존 보험 해지/재시도 실패", error);
 alert("기존 보험 해지 또는 재가입 처리 중 오류가 발생했습니다.");
 } finally {
 setIsCancelSubmitting(false);
 }
 };

 if (isLoading) {
 return <div className="p-20 text-center font-bold">로딩 중...</div>;
 }

 if (isError) {
 return (
 <div className="p-20 text-center">
 <div className="text-xl font-bold text-slate-900 mb-4">데이터를 불러오는 중 오류가 발생했습니다.</div>
 <p className="text-slate-500 mb-8">잠시 후 다시 시도해주세요.</p>
 <button
 onClick={() => navigate(-1)}
 className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold -200"
 >
 뒤로가기
 </button>
 </div>
 );
 }

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
 <button
 onClick={() => navigate(-1)}
 className="flex items-center gap-1 text-slate-400 hover:text-slate-600 font-medium"
 >
 <ChevronLeft size={20} /> 뒤로가기
 </button>
 <div className="flex items-center gap-3">
 <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-100">
 안전점수 {safetyScore ?? 0}점
 </span>
 {currentPrices.discountAmount > 0 && (
 <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
 <ShieldCheck size={14} /> 안전운전 할인 {formatCurrency(currentPrices.discountAmount)} 절약 중
 </span>
 )}
 </div>
 </div>

 <header className="mb-12 text-left">
 <div className="text-[#FF5C35] font-bold text-base mb-2">보험료 확인</div>
 <h1 className="text-[32px] font-bold text-slate-900 leading-tight">
 자동차보험, 중요하지만 비싸죠.<br />어디까지 보장받아야 할까요?
 </h1>
 </header>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-12">
 {(["BASIC", "STANDARD", "PREMIUM"] as const).map((type) => {
 const isSelected = selectedPlan === type;
 const { basePremium, finalPremium } = calculatePremiums(type);

 return (
 <div
 key={type}
 onClick={() => handlePlanChange(type)}
 className={`cursor-pointer transition-all duration-300 ${isSelected ? "lg:scale-105 z-10" : "opacity-60"}`}
 >
 <div className={`bg-white rounded-[32px] border-2 p-8 flex flex-col ${isSelected ? "border-[#FF5C35] /10" : "border-slate-100"}`}>
 <div className={`text-sm font-bold mb-2 ${isSelected ? "text-[#FF5C35]" : "text-slate-400"}`}>
 {PLAN_LABELS[type].title}
 </div>
 {basePremium !== finalPremium && (
 <div className="text-xs text-slate-400 font-bold line-through mb-1">{formatCurrency(basePremium)}</div>
 )}
 <div className="text-2xl font-black text-slate-900">{formatCurrency(finalPremium)}</div>
 </div>
 </div>
 );
 })}
 </div>

 {/* 보험료 산출 내역 */}
 <div className="bg-white rounded-[32px] border border-slate-100 p-8 mb-8">
 <h3 className="text-base font-black text-slate-900 mb-6">보험료 산출 내역</h3>
 <div className="space-y-3 text-sm">
 {/* 기본 보험료 */}
 <div className="flex justify-between items-center">
 <span className="text-slate-500">기본 보험료</span>
 <span className="font-bold text-slate-900">{formatCurrency(productInfo?.baseAmount || 0)}</span>
 </div>

 {/* 나이 계수 */}
 <div className="flex justify-between items-center">
 <span className="text-slate-500">
 나이 계수
 <span className="ml-2 text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
 {getAgeFactorLabel(estimates[selectedPlan]?.ageFactor ?? 1.0)}
 </span>
 </span>
 <span className={`font-bold ${(estimates[selectedPlan]?.ageFactor ?? 1.0) > 1 ? "text-rose-500" : "text-emerald-600"}`}>
 × {(estimates[selectedPlan]?.ageFactor ?? 1.0).toFixed(2)}
 </span>
 </div>

 {/* 운전경력 계수 */}
 <div className="flex justify-between items-center">
 <span className="text-slate-500">
 운전경력 계수
 <span className="ml-2 text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
 {getExpFactorLabel(estimates[selectedPlan]?.experienceFactor ?? 1.0)}
 </span>
 </span>
 <span className={`font-bold ${(estimates[selectedPlan]?.experienceFactor ?? 1.0) > 1 ? "text-rose-500" : "text-emerald-600"}`}>
 × {(estimates[selectedPlan]?.experienceFactor ?? 1.0).toFixed(3)}
 </span>
 </div>

 {/* 플랜 계수 */}
 <div className="flex justify-between items-center">
 <span className="text-slate-500">
 플랜 계수
 <span className="ml-2 text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
 {PLAN_LABELS[selectedPlan].title}
 </span>
 </span>
 <span className={`font-bold ${PLAN_MULTIPLIERS[selectedPlan] > 1 ? "text-rose-500" : "text-emerald-600"}`}>
 × {PLAN_MULTIPLIERS[selectedPlan].toFixed(1)}
 </span>
 </div>

 {/* 구분선 + 할인 전 금액 */}
 <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
 <span className="text-slate-500">할인 전 보험료</span>
 <span className="font-bold text-slate-900">{formatCurrency(currentPrices.basePremium)}</span>
 </div>

 {/* 안전운전 할인 */}
 <div className="flex justify-between items-center">
 <span className="text-slate-500">
 안전운전 할인
 <span className="ml-2 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
 {safetyScore ?? 0}점 적용
 </span>
 </span>
 <span className="font-bold text-blue-600">
 {currentPrices.discountAmount > 0
 ? `- ${formatCurrency(currentPrices.discountAmount)} (${Math.round((estimates[selectedPlan]?.discountRate ?? 0) * 1000) / 10}%)`
 : "해당 없음"}
 </span>
 </div>

 {/* 최종 금액 */}
 <div className="border-t-2 border-slate-200 pt-4 flex justify-between items-center">
 <span className="text-base font-black text-slate-900">최종 보험료</span>
 <span className="text-2xl font-black text-slate-900">{formatCurrency(currentPrices.finalPremium)}</span>
 </div>
 </div>
 </div>

 <div className="space-y-6">
 {Object.entries(groupedCoverages).map(([category, items]) => (
 <div key={category} className="bg-white rounded-[32px] border border-slate-100 overflow-hidden ">
 <button
 onClick={() => toggleCategory(category)}
 className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
 >
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
 className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${isSelected ? "bg-[#FF5C35]" : "border-2 border-slate-200"} ${!isSelectable ? "cursor-not-allowed" : "hover:border-[#FF5C35]"}`}
 >
 {isSelected && <Check size={16} className="text-white" strokeWidth={3} />}
 </button>
 <div className="flex flex-col text-left">
 <div className="flex items-center gap-2">
 <span className={`text-[15px] font-bold ${isSelected ? "text-slate-900" : "text-slate-400"}`}>
 {cov.coverageName}
 </span>
 {!isSelectable && (
 <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">
 {cov.planType} 전용
 </span>
 )}
 </div>
 </div>
 </div>
 <div className={`text-[15px] font-bold ${isSelected ? "text-[#FF5C35]" : "text-slate-300"}`}>
 {isSelected
 ? (cov.coverageAmount >= 100000000
 ? `${(cov.coverageAmount / 100000000).toLocaleString()}억원`
 : `${(cov.coverageAmount / 10000).toLocaleString()}만원`)
 : "미가입"}
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>
 ))}
 </div>

 <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-6 z-50 ">
 <div className="max-w-5xl mx-auto flex items-center justify-between">
 <div className="text-left flex items-center gap-6">
 <div>
 <div className="text-xs font-bold text-slate-400 mb-1">
 {productInfo?.companyName} {PLAN_LABELS[selectedPlan].title} 가입
 </div>
 <div className="text-2xl font-black text-slate-900">{formatCurrency(currentPrices.finalPremium)}</div>
 </div>
 {currentPrices.discountAmount > 0 && (
 <>
 <div className="h-10 w-[1px] bg-slate-100" />
 <div className="text-left">
 <div className="text-[10px] font-bold text-blue-500 mb-0.5">안전운전 할인 혜택</div>
 <div className="text-lg font-bold text-blue-600">-{formatCurrency(currentPrices.discountAmount)}</div>
 </div>
 </>
 )}
 </div>
 <button
 onClick={handleOpenSignature}
 disabled={isSubmitting}
 className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-lg -200 hover:bg-blue-700 active:scale-[0.98] transition-all"
 >
 최종 가입 완료하기
 </button>
 </div>
 </div>
 </div>

 {isSignatureModalOpen && (
 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
 <div className="bg-white rounded-4xl w-full max-w-lg p-8 space-y-6">
 <div className="text-left space-y-1">
 <h2 className="text-2xl font-black text-slate-900">서명해주세요</h2>
 <p className="text-sm text-slate-400">아래 칸에 서명 후 가입을 확정해주세요.</p>
 </div>

 <div className="border-2 border-slate-200 rounded-[20px] overflow-hidden bg-slate-50">
 <SignatureCanvas
 ref={signatureRef}
 penColor="#143D60"
 canvasProps={{ width: 460, height: 200, className: "w-full" }}
 onEnd={() => setIsSigned(true)}
 />
 </div>

 <div className="flex gap-3">
 <button
 onClick={handleClearSignature}
 className="flex items-center gap-2 px-6 py-4 rounded-[16px] border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all"
 >
 <RotateCcw size={18} /> 다시 서명
 </button>
 <button
 onClick={handleFinalApply}
 disabled={!isSigned || isSubmitting}
 className={`flex-1 py-4 rounded-[16px] font-black text-lg transition-all ${
 isSigned && !isSubmitting
 ? "bg-blue-600 text-white -200 hover:bg-blue-700"
 : "bg-slate-100 text-slate-300 cursor-not-allowed"
 }`}
 >
 {isSubmitting ? "처리 중..." : "가입 확정"}
 </button>
 </div>

 <button
 onClick={() => setIsSignatureModalOpen(false)}
 className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors"
 >
 취소
 </button>
 </div>
 </div>
 )}

 {isCancelModalOpen && (
 <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-6">
 <div className="bg-white rounded-[28px] w-full max-w-md p-7 space-y-5">
 <div className="text-left space-y-2">
 <h3 className="text-xl font-black text-slate-900">기존 보험 해지가 필요합니다</h3>
 <p className="text-sm text-slate-500 leading-relaxed">
 이미 활성화된 보험이 있어 새 보험에 가입할 수 없습니다.
 <br />
 기존 보험을 해지한 뒤 새 보험 가입을 계속 진행할까요?
 </p>
 </div>

 <div className="flex gap-3">
 <button
 onClick={() => {
 setIsCancelModalOpen(false);
 setCancelTargetContractId(null);
 }}
 disabled={isCancelSubmitting}
 className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
 >
 취소
 </button>
 <button
 onClick={handleCancelAndRetry}
 disabled={isCancelSubmitting}
 className={`flex-1 py-3.5 rounded-xl font-black text-white transition-colors ${
 isCancelSubmitting ? "bg-slate-300 cursor-not-allowed" : "bg-[#FF5C35] hover:bg-[#ff4c20]"
 }`}
 >
 {isCancelSubmitting ? "해지 처리 중..." : "해지 후 계속"}
 </button>
 </div>
 </div>
 </div>
 )}

 {isCheckoutPopupOpen && (
 <div className="fixed top-6 right-6 z-70 max-w-sm bg-blue-600 text-white rounded-2xl px-5 py-4">
 <div className="text-sm font-bold mb-1">결제창이 새 창에서 열렸습니다</div>
 <p className="text-xs leading-relaxed text-blue-100">
 새 창에서 결제를 완료한 뒤 현재 화면으로 돌아와 주세요.
 </p>
 <button
 onClick={() => setIsCheckoutPopupOpen(false)}
 className="mt-3 text-xs font-bold text-white/90 hover:text-white"
 >
 안내 닫기
 </button>
 </div>
 )}
 </div>
 );
}
