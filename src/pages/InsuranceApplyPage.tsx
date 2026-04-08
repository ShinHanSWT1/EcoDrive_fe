import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Search, Check } from "lucide-react";
import { api } from "../shared/api/client";

export default function InsuranceApplyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const productId = Number(searchParams.get("productId"));
  const selectedPlan = searchParams.get("plan") || "BASIC";
  
  const [isLoading, setIsLoading] = useState(true);
  
  // 입력 상태
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [addressType, setAddressType] = useState<"HOME" | "WORK">("HOME");
  const [address, setAddress] = useState("");

  // 약정 동의 상태
  const [agreements, setAgreements] = useState({
    actualOwner: false,
    beneficiary: false,
    termination: false
  });

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const userRes = await api.get("/users/me");
        setEmail(userRes.data.data.email || "");
      } catch (error) {
        console.error("사용자 정보 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserInfo();
  }, []);

  const isAllAgreed = agreements.actualOwner && agreements.beneficiary && agreements.termination;
  const isFormValid = phoneNumber && address && email && isAllAgreed;

  const handleNext = () => {
    if (!isFormValid) return;

    navigate(`/insurance/confirm?productId=${productId}&plan=${selectedPlan}`, {
      state: {
        phoneNumber,
        email,
        address: `[${addressType === "HOME" ? "집" : "직장"}] ${address}`
      }
    });
  };

  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) return <div className="p-20 text-center font-bold">로딩 중...</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto py-16 px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-600 font-medium mb-12 transition-colors"
        >
          <ChevronLeft size={20} /> 뒤로가기
        </button>

        <div className="space-y-16">
          <header className="space-y-3 text-left">
            <div className="text-[#FF5C35] font-bold text-base">피보험자/계약자 정보</div>
            <h1 className="text-[34px] font-bold text-slate-900 leading-tight tracking-tight">
              보험 가입을 위해 고객님의 정보를 입력해주세요
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
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full px-6 py-5 rounded-[20px] border border-slate-200 bg-[#F2F4F6] focus:outline-none focus:ring-2 focus:ring-[#FF5C35]/20 focus:border-[#FF5C35] transition-all text-slate-700 font-medium text-lg"
                />
              </div>

              <div className="space-y-3 text-left">
                <label className="text-sm font-bold text-slate-400 ml-1">이메일</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-6 py-5 rounded-[20px] border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C35]/20 focus:border-[#FF5C35] transition-all text-slate-700 font-medium text-lg"
                />
              </div>

              <div className="md:col-span-2 space-y-4 text-left">
                <label className="text-sm font-bold text-slate-400 ml-1">우편물 받는 곳</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setAddressType("HOME")}
                    className={`w-[180px] py-5 rounded-[16px] font-bold transition-all border-2 text-lg ${
                      addressType === "HOME" 
                        ? "bg-white border-[#FF5C35] text-[#FF5C35]" 
                        : "bg-white border-slate-100 text-slate-400"
                    }`}
                  >
                    집
                  </button>
                  <button 
                    onClick={() => setAddressType("WORK")}
                    className={`w-[180px] py-5 rounded-[16px] font-bold transition-all border-2 text-lg ${
                      addressType === "WORK" 
                        ? "bg-white border-[#FF5C35] text-[#FF5C35]" 
                        : "bg-white border-slate-100 text-slate-400"
                    }`}
                  >
                    직장
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 relative text-left">
                <div className="relative group">
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="주소를 입력해 주세요"
                    className="w-full pl-8 pr-16 py-6 rounded-[24px] border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C35]/20 focus:border-[#FF5C35] transition-all text-slate-700 font-medium text-xl shadow-sm"
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF5C35] transition-colors">
                    <Search size={28} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 약정 동의 섹션 (스크린샷 기반) */}
          <section className="space-y-4">
            {[
              { id: 'actualOwner', label: '이 금융 거래의 실제 소유자입니다.' },
              { id: 'beneficiary', label: '보험수익자 지정/변경 약정에 동의합니다.' },
              { id: 'termination', label: '통신수단을 이용한 계약해지에 동의합니다.' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => toggleAgreement(item.id as keyof typeof agreements)}
                className="w-full flex items-center gap-4 px-8 py-6 rounded-[24px] border border-slate-200 hover:bg-slate-50 transition-all text-left group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  agreements[item.id as keyof typeof agreements] 
                    ? "bg-[#FF5C35]" 
                    : "bg-slate-100"
                }`}>
                  <Check size={20} className="text-white" strokeWidth={3} />
                </div>
                <span className={`text-lg font-bold ${
                  agreements[item.id as keyof typeof agreements] 
                    ? "text-slate-900" 
                    : "text-slate-500"
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </section>

          <footer className="pt-16 border-t border-slate-100 flex justify-end">
            <button 
              onClick={handleNext}
              disabled={!isFormValid}
              className={`min-w-[340px] py-6 rounded-[24px] font-black text-xl transition-all shadow-2xl ${
                isFormValid 
                  ? "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 active:scale-[0.98]" 
                  : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
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
