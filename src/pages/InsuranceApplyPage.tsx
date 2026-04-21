import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, ChevronLeft } from "lucide-react";
import { api } from "../shared/api/client";
import type { AddressResult } from "../shared/api/address";
import type { PlanType } from "../features/insurance/insurance.constants";
import { PLAN_RANK } from "../features/insurance/insurance.constants";

type AddressMessage = {
 type: "ECODRIVE_ADDRESS_SELECTED";
 payload: AddressResult;
};

export default function InsuranceApplyPage() {
 const [searchParams] = useSearchParams();
 const navigate = useNavigate();

 const productId = Number(searchParams.get("productId"));
 const userVehicleId = Number(searchParams.get("userVehicleId"));
 const planParam = searchParams.get("plan") ?? "";
 const selectedPlan: PlanType =
 planParam in PLAN_RANK ? (planParam as PlanType) : "BASIC";

 if (!productId || Number.isNaN(productId) || !userVehicleId || Number.isNaN(userVehicleId)) {
 return (
 <div className="p-20 text-center font-bold text-red-500">
 잘못된 접근입니다. 보험 상품을 다시 선택해 주세요.
 </div>
 );
 }

 const [isLoading, setIsLoading] = useState(true);

 const [phoneNumber, setPhoneNumber] = useState("");
 const [email, setEmail] = useState("");
 const [addressType, setAddressType] = useState<"HOME" | "WORK">("HOME");
 const [zipCode, setZipCode] = useState("");
 const [address, setAddress] = useState("");
 const [addressDetail, setAddressDetail] = useState("");
 const [extraAddress, setExtraAddress] = useState("");

 const [agreements, setAgreements] = useState({
 actualOwner: false,
 beneficiary: false,
 termination: false,
 });

 useEffect(() => {
 async function fetchUserInfo() {
 try {
 const userRes = await api.get("/users/me");
 if (userRes.data && userRes.data.data) {
 setEmail(userRes.data.data.email || "");
 }
 } catch {
 console.warn("[보험 가입] 사용자 정보를 불러오지 못했습니다.");
 } finally {
 setIsLoading(false);
 }
 }
 fetchUserInfo();
 }, []);

 useEffect(() => {
 const handleAddressMessage = (event: MessageEvent<AddressMessage>) => {
 if (event.origin !== window.location.origin) {
 return;
 }
 if (!event.data || event.data.type !== "ECODRIVE_ADDRESS_SELECTED") {
 return;
 }

 const selected = event.data.payload;
 setZipCode(selected.zipNo);
 setAddress(selected.roadAddr);
 setExtraAddress(selected.bdNm || "");
 console.info("[보험 가입] 주소 팝업에서 주소를 적용했습니다.", {
 zipNo: selected.zipNo,
 roadAddr: selected.roadAddr,
 });
 };

 window.addEventListener("message", handleAddressMessage);
 return () => window.removeEventListener("message", handleAddressMessage);
 }, []);

 const isPhoneValid = /^010-\d{4}-\d{4}$/.test(phoneNumber);
 const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
 const isAllAgreed = agreements.actualOwner && agreements.beneficiary && agreements.termination;
 const isFormValid = isPhoneValid && isEmailValid && address && isAllAgreed;

 const handleNext = () => {
 if (!isFormValid) return;

 navigate(`/insurance/confirm?productId=${productId}&plan=${selectedPlan}`, {
 state: {
 userVehicleId,
 phoneNumber,
 email,
 address: `[${addressType === "HOME" ? "집" : "직장"}] (${zipCode}) ${address} ${addressDetail} ${extraAddress}`.trim(),
 },
 });
 };

 const toggleAgreement = (key: keyof typeof agreements) => {
 setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
 };

 const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
 const digits = event.target.value.replace(/\D/g, "");
 if (digits.length >= 3 && !digits.startsWith("010")) return;

 let formatted = digits;
 if (digits.length > 3 && digits.length <= 7) {
 formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
 } else if (digits.length > 7) {
 formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
 }

 setPhoneNumber(formatted);
 };

 const handleOpenAddressPopup = () => {
 const popup = window.open(
 "/address/search-popup",
 "EcodriveAddressSearch",
 "width=680,height=720,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes",
 );

 if (!popup) {
 alert("팝업이 차단되어 주소 찾기를 열 수 없습니다. 팝업 차단을 해제해 주세요.");
 return;
 }

 popup.focus();
 };

 if (isLoading) {
 return <div className="p-20 text-center font-bold">로딩 중...</div>;
 }

 return (
 <div className="bg-white min-h-screen">
 <div className="max-w-[1400px] mx-auto py-16 px-8">
 <button
 onClick={() => navigate(-1)}
 className="flex items-center gap-1 text-slate-400 hover:text-slate-600 font-medium mb-12 transition-colors"
 >
 <ChevronLeft size={20} /> 뒤로가기
 </button>

 <div className="space-y-16">
 <header className="space-y-3 text-left">
 <div className="text-[#1A5D40] font-bold text-base">피보험자/계약자 정보</div>
 <h1 className="text-[34px] font-bold text-slate-900 leading-tight tracking-tight">
 보험 가입을 위해 고객님의 정보를 입력해 주세요
 </h1>
 </header>

 <section className="space-y-12">
 <h3 className="text-2xl font-bold text-slate-900">연락처 정보</h3>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
 <div className="space-y-3 text-left">
 <label className="text-sm font-bold text-slate-400 ml-1">휴대폰번호</label>
 <input
 type="text"
 value={phoneNumber}
 onChange={handlePhoneNumberChange}
 placeholder="010-0000-0000"
 maxLength={13}
 className={`w-full px-6 py-5 rounded-[20px] border bg-[#F2F4F6] focus:outline-none focus:ring-2 transition-all text-slate-700 font-medium text-lg ${
 phoneNumber && !isPhoneValid
 ? "border-red-400 focus:ring-red-200 focus:border-red-400"
 : "border-slate-200 focus:ring-[#1A5D40]/20 focus:border-[#1A5D40]"
 }`}
 />
 {phoneNumber && !isPhoneValid && (
 <p className="text-red-400 text-sm ml-1 mt-1">010-0000-0000 형식으로 입력해 주세요.</p>
 )}
 </div>

 <div className="space-y-3 text-left">
 <label className="text-sm font-bold text-slate-400 ml-1">이메일<span className="text-[#1A5D40]">*</span></label>
 <input
 type="email"
 value={email}
 onChange={(event) => setEmail(event.target.value)}
 placeholder="example@gmail.com"
 className={`w-full px-6 py-5 rounded-[20px] border bg-white focus:outline-none focus:ring-2 transition-all text-slate-700 font-medium text-lg ${
 email && !isEmailValid
 ? "border-red-400 focus:ring-red-200 focus:border-red-400"
 : "border-slate-200 focus:ring-[#1A5D40]/20 focus:border-[#1A5D40]"
 }`}
 />
 {email && !isEmailValid && (
 <p className="text-red-400 text-sm ml-1 mt-1">올바른 이메일 형식으로 입력해 주세요.</p>
 )}
 </div>

 <div className="md:col-span-2 space-y-4 text-left">
 <label className="text-sm font-bold text-slate-400 ml-1">우편물 받는 곳</label>
 <div className="flex gap-4">
 <button
 onClick={() => setAddressType("HOME")}
 className={`w-[180px] py-5 rounded-[16px] font-bold transition-all border-2 text-lg ${
 addressType === "HOME"
 ? "bg-white border-[#1A5D40] text-[#1A5D40]"
 : "bg-white border-slate-100 text-slate-400"
 }`}
 >
 집
 </button>
 <button
 onClick={() => setAddressType("WORK")}
 className={`w-[180px] py-5 rounded-[16px] font-bold transition-all border-2 text-lg ${
 addressType === "WORK"
 ? "bg-white border-[#1A5D40] text-[#1A5D40]"
 : "bg-white border-slate-100 text-slate-400"
 }`}
 >
 직장
 </button>
 </div>
 </div>

 <div className="md:col-span-2 space-y-3 text-left">
 <div className="flex gap-3">
 <input
 type="text"
 value={zipCode}
 readOnly
 placeholder="우편번호"
 className="w-[160px] px-6 py-5 rounded-[20px] border border-slate-200 bg-[#F2F4F6] text-slate-700 font-medium text-lg focus:outline-none"
 />
 <button
 onClick={handleOpenAddressPopup}
 className="px-8 py-5 rounded-[20px] bg-slate-800 text-white font-bold text-lg hover:bg-slate-700 transition-all active:scale-[0.98]"
 >
 우편번호 찾기
 </button>
 </div>

 <input
 type="text"
 value={address}
 readOnly
 placeholder="주소"
 className="w-full px-6 py-5 rounded-[20px] border border-slate-200 bg-[#F2F4F6] text-slate-700 font-medium text-lg focus:outline-none"
 />

 <div className="flex gap-3">
 <input
 type="text"
 value={addressDetail}
 onChange={(event) => setAddressDetail(event.target.value)}
 placeholder="상세주소"
 className="flex-1 px-6 py-5 rounded-[20px] border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5D40]/20 focus:border-[#1A5D40] transition-all text-slate-700 font-medium text-lg"
 />
 <input
 type="text"
 value={extraAddress}
 readOnly
 placeholder="참고항목"
 className="flex-1 px-6 py-5 rounded-[20px] border border-slate-200 bg-[#F2F4F6] text-slate-400 font-medium text-lg focus:outline-none"
 />
 </div>
 </div>
 </div>
 </section>

 <section className="space-y-4">
 {[
 { id: "actualOwner", label: "본 금융 거래의 실제 소유자입니다." },
 { id: "beneficiary", label: "보험수익자 지정 변경 약정에 동의합니다." },
 { id: "termination", label: "통신수단 및 이용약관 해지에 동의합니다." },
 ].map((item) => (
 <button
 key={item.id}
 onClick={() => toggleAgreement(item.id as keyof typeof agreements)}
 className="w-full flex items-center gap-4 px-8 py-6 rounded-[24px] border border-slate-200 hover:bg-slate-50 transition-all text-left"
 >
 <div
 className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
 agreements[item.id as keyof typeof agreements] ? "bg-[#1A5D40]" : "bg-slate-100"
 }`}
 >
 <Check size={20} className="text-white" strokeWidth={3} />
 </div>
 <span
 className={`text-lg font-bold ${
 agreements[item.id as keyof typeof agreements] ? "text-slate-900" : "text-slate-500"
 }`}
 >
 {item.label}
 </span>
 </button>
 ))}
 </section>

 <footer className="pt-16 border-t border-slate-100 flex justify-end">
 <button
 onClick={handleNext}
 disabled={!isFormValid}
 className={`min-w-[340px] py-6 rounded-[24px] font-black text-xl transition-all ${
 isFormValid
 ? "bg-[#1A5D40] text-white hover:bg-[#143D60] active:scale-[0.98]"
 : "bg-slate-100 text-slate-300 cursor-not-allowed"
 }`}
 >
 모두 입력했어요
 </button>
 </footer>
 </div>
 </div>
 </div>
 );
}
