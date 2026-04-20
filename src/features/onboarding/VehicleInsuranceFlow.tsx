import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { cn } from "../../shared/lib/utils";
import {
 completeMyOnboarding,
 registerMyInsurance,
 registerMyVehicle,
 searchVehicleModels,
 type VehicleModelSummary,
} from "../../shared/api/onboarding";
import { fetchMe } from "../../shared/api/auth";
import { api } from "../../shared/api/client";
import type { UserMe } from "../../shared/types/api";
import VehicleStep from "./VehicleStep";
import InsuranceStep from "./InsuranceStep";
import { PLAN_MULTIPLIERS } from "../insurance/insurance.constants";

type FlowMode = "onboarding" | "vehicle-add";

export default function VehicleInsuranceFlow({
 onUserUpdate,
 mode,
}: {
 onUserUpdate: (user: UserMe) => void;
 mode: FlowMode;
}) {
 const [step, setStep] = useState(1);
 const [vehicleNumber, setVehicleNumber] = useState("");
 const [vehicleKeyword, setVehicleKeyword] = useState("");
 const [vehicleModels, setVehicleModels] = useState<VehicleModelSummary[]>([]);
 const [selectedVehicleModel, setSelectedVehicleModel] = useState<VehicleModelSummary | null>(null);
 const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
 const [insuranceCompanyList, setInsuranceCompanyList] = useState<{ id: number; companyName: string }[]>([]);
 const [insuranceCompanyName, setInsuranceCompanyName] = useState("");
 const [insuranceProductName, setInsuranceProductName] = useState("");
 const [insuranceProductBaseAmount, setInsuranceProductBaseAmount] = useState(0);
 const [selectedPlan, setSelectedPlan] = useState<"BASIC" | "STANDARD" | "PREMIUM">("STANDARD");
 const [insuranceStartedAt, setInsuranceStartedAt] = useState("");
 const [age, setAge] = useState<number | "">("");
 const [userVehicleId, setUserVehicleId] = useState<number | null>(null);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [isSearchingModels, setIsSearchingModels] = useState(false);
 const [vehicleErrorMessage, setVehicleErrorMessage] = useState<string | null>(null);
 const [insuranceErrorMessage, setInsuranceErrorMessage] = useState<string | null>(null);
 const vehicleSearchRef = useRef<HTMLDivElement | null>(null);
 const vehicleSearchRequestIdRef = useRef(0);
 const navigate = useNavigate();
 const insuranceCompanies = insuranceCompanyList.map((company) => company.companyName);

 async function loadInsuranceCompanies() {
 try {
 const res = await api.get("/insurance/companies");
 const rawCompanies: { id: number; companyName: string; status: string }[] =
 (res.data.data.companies || []).filter((c: { status: string }) => c.status === "ACTIVE");
 const activeCompanies = rawCompanies.map(({ id, companyName }) => ({ id, companyName }));
 setInsuranceCompanyList(activeCompanies);

 if (activeCompanies.length > 0) {
 setInsuranceCompanyName(activeCompanies[0].companyName);
 }
 } catch {
 const fallbackCompanies = ["삼성화재", "현대해상", "DB손해보험", "KB손해보험"];
 const fallbackList = fallbackCompanies.map((companyName, index) => ({
 id: index + 1,
 companyName,
 }));
 setInsuranceCompanyList(fallbackList);
 setInsuranceCompanyName(fallbackList[0].companyName);
 }
 }

 async function loadInsuranceProducts(companyName: string) {
 const company = insuranceCompanyList.find((item) => item.companyName === companyName);
 if (!company) {
 setInsuranceProductName("");
 setInsuranceProductBaseAmount(0);
 return;
 }

 try {
 const res = await api.get("/insurance/products", {
 params: { insuranceCompanyId: company.id },
 });
 const products: { productName: string; baseAmount: number; status: string }[] =
 (res.data.data.products || []).filter(
 (product: { status: string }) => product.status === "ON_SALE" || product.status === "ACTIVE",
 );

 if (products.length > 0) {
 setInsuranceProductName(products[0].productName);
 setInsuranceProductBaseAmount(products[0].baseAmount ?? 0);
 return;
 }
 } catch {
 // no-op
 }

 setInsuranceProductName("");
 setInsuranceProductBaseAmount(0);
 }

 useEffect(() => {
 void loadInsuranceCompanies();
 }, []);

 useEffect(() => {
 if (!insuranceCompanyName) {
 return;
 }

 void loadInsuranceProducts(insuranceCompanyName);
 }, [insuranceCompanyName, insuranceCompanyList]);

 const handleSearchVehicleModels = async (keyword: string) => {
 const trimmedKeyword = keyword.trim();
 const requestId = ++vehicleSearchRequestIdRef.current;

 if (!trimmedKeyword) {
 setVehicleModels([]);
 setIsSearchingModels(false);
 return;
 }

 setIsSearchingModels(true);
 setVehicleErrorMessage(null);

 try {
 const models = await searchVehicleModels(trimmedKeyword);

 if (requestId !== vehicleSearchRequestIdRef.current) {
 return;
 }

 setVehicleModels(models);
 } catch (error) {
 if (requestId !== vehicleSearchRequestIdRef.current) {
 return;
 }

 console.error(error);
 setVehicleErrorMessage("차량 모델 조회에 실패했습니다.");
 } finally {
 if (requestId === vehicleSearchRequestIdRef.current) {
 setIsSearchingModels(false);
 }
 }
 };

 useEffect(() => {
 const debounce = window.setTimeout(() => {
 void handleSearchVehicleModels(vehicleKeyword);
 }, 250);

 return () => {
 vehicleSearchRequestIdRef.current += 1;
 window.clearTimeout(debounce);
 };
 }, [vehicleKeyword]);

 useEffect(() => {
 const handlePointerDown = (event: MouseEvent) => {
 if (!vehicleSearchRef.current?.contains(event.target as Node)) {
 setIsVehicleDropdownOpen(false);
 }
 };

 document.addEventListener("mousedown", handlePointerDown);

 return () => document.removeEventListener("mousedown", handlePointerDown);
 }, []);

 const nextStep = async () => {
 if (isSubmitting) {
 return;
 }

 if (!vehicleNumber.trim()) {
 setVehicleErrorMessage("차량 번호를 입력해주세요.");
 return;
 }

 if (!selectedVehicleModel) {
 setVehicleErrorMessage("차량 모델을 검색 후 선택해주세요.");
 return;
 }

 setIsSubmitting(true);
 setVehicleErrorMessage(null);

 try {
 const vehicle = await registerMyVehicle({
 vehicleNumber,
 vehicleModelId: selectedVehicleModel.id,
 });

 setUserVehicleId(vehicle.userVehicleId);
 setStep(2);
 } catch (error) {
 console.error(error);
 setVehicleErrorMessage("차량 등록에 실패했습니다.");
 } finally {
 setIsSubmitting(false);
 }
 };

 const submitInsurance = async () => {
 if (isSubmitting) {
 return;
 }

 if (!userVehicleId) {
 setInsuranceErrorMessage("등록된 차량 정보가 없습니다.");
 return;
 }

 if (!insuranceCompanyName.trim()) {
 setInsuranceErrorMessage("보험사를 선택해주세요.");
 return;
 }

 const parsedAnnualPremium = Math.round(
 insuranceProductBaseAmount * PLAN_MULTIPLIERS[selectedPlan],
 );
 if (!parsedAnnualPremium || parsedAnnualPremium <= 0) {
 setInsuranceErrorMessage("보험 상품 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
 return;
 }

 if (!insuranceStartedAt) {
 setInsuranceErrorMessage("보험 가입일을 입력해주세요.");
 return;
 }

 const ageValue = Number(age);
 if (!age || Number.isNaN(ageValue) || ageValue <= 0 || ageValue > 120) {
 setInsuranceErrorMessage("올바른 나이(1-120세)를 입력해주세요.");
 return;
 }

 setIsSubmitting(true);
 setInsuranceErrorMessage(null);

 try {
 await registerMyInsurance({
 userVehicleId,
 insuranceCompanyName,
 insuranceProductName: insuranceProductName || undefined,
 planType: selectedPlan,
 annualPremium: parsedAnnualPremium,
 insuranceStartedAt,
 age: Number(age),
 });

 if (mode === "onboarding") {
 const onboardingResult = await completeMyOnboarding();
 const me = await fetchMe();
 onUserUpdate(me);
 navigate(onboardingResult.isOnboardingCompleted ? "/" : "/onboarding", {
 replace: true,
 });
 return;
 }

 const me = await fetchMe();
 onUserUpdate(me);
 navigate("/", { replace: true });
 } catch (error) {
 console.error(error);
 setInsuranceErrorMessage("보험 등록에 실패했습니다.");
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <div className="min-h-[80vh] flex items-center justify-center p-4">
 <div className="w-full max-w-2xl">
 <div className="flex justify-between items-center mb-12 px-4">
 {[1, 2].map((i) => (
 <div key={i} className="flex items-center flex-1 last:flex-none">
 <div
 className={cn(
 "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500",
 step >= i ? "bg-blue-600 text-white -200" : "bg-slate-200 text-slate-400",
 )}
 >
 {step > i ? <CheckCircle2 size={20} /> : i}
 </div>
 {i < 2 ? (
 <div
 className={cn(
 "flex-1 h-1 mx-4 rounded-full transition-all duration-500",
 step > i ? "bg-blue-600" : "bg-slate-200",
 )}
 />
 ) : null}
 </div>
 ))}
 </div>

 <AnimatePresence mode="wait">
 {step === 1 ? (
 <VehicleStep
 vehicleKeyword={vehicleKeyword}
 vehicleModels={vehicleModels}
 selectedVehicleModel={selectedVehicleModel}
 vehicleNumber={vehicleNumber}
 isVehicleDropdownOpen={isVehicleDropdownOpen}
 isSearchingModels={isSearchingModels}
 isSubmitting={isSubmitting}
 errorMessage={vehicleErrorMessage}
 vehicleSearchRef={vehicleSearchRef}
 onVehicleKeywordFocus={() => setIsVehicleDropdownOpen(true)}
 onVehicleKeywordChange={(value) => {
 setVehicleKeyword(value);
 setSelectedVehicleModel(null);
 setIsVehicleDropdownOpen(true);
 }}
 onVehicleModelSelect={(model) => {
 setSelectedVehicleModel(model);
 setVehicleKeyword(`${model.manufacturer} ${model.modelName} ${model.modelYear}`);
 setVehicleModels([]);
 setIsVehicleDropdownOpen(false);
 }}
 onVehicleNumberChange={setVehicleNumber}
 onNextStep={() => void nextStep()}
 />
 ) : (
 <InsuranceStep
 insuranceCompanyName={insuranceCompanyName}
 insuranceCompanies={insuranceCompanies}
 selectedPlan={selectedPlan}
 productName={insuranceProductName}
 productBaseAmount={insuranceProductBaseAmount}
 insuranceStartedAt={insuranceStartedAt}
 age={age}
 isSubmitting={isSubmitting}
 errorMessage={insuranceErrorMessage}
 onInsuranceCompanyChange={setInsuranceCompanyName}
 onPlanChange={setSelectedPlan}
 onInsuranceStartedAtChange={setInsuranceStartedAt}
 onAgeChange={setAge}
 onPrevStep={() => setStep(1)}
 onSubmit={() => void submitInsurance()}
 />
 )}
 </AnimatePresence>
 </div>
 </div>
 );
}
