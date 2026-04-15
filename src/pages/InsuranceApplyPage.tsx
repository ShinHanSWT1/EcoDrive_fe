import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Check, Search, Loader2 } from "lucide-react";
import { api } from "../shared/api/client";
import { searchAddress } from "../shared/api/address";
import type { AddressResult } from "../shared/api/address";
import type { PlanType } from "../features/insurance/insurance.constants";
import { PLAN_RANK } from "../features/insurance/insurance.constants";

export default function InsuranceApplyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const productId = Number(searchParams.get("productId"));
  const planParam = searchParams.get("plan") ?? "";
  const selectedPlan: PlanType =
    planParam in PLAN_RANK ? (planParam as PlanType) : "BASIC";

  if (!productId || isNaN(productId)) {
    return (
      <div className="p-20 text-center font-bold text-red-500">
        잘못된 접근입니다. 보험 상품을 다시 선택해주세요.
      </div>
    );
  }

  const [isLoading, setIsLoading] = useState(true);

  // 입력 상태
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [addressType, setAddressType] = useState<"HOME" | "WORK">("HOME");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [extraAddress, setExtraAddress] = useState("");
  const [isAddressVisible, setIsAddressVisible] = useState(false);
  const [addressKeyword, setAddressKeyword] = useState("");
  const [addressResults, setAddressResults] = useState<AddressResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // 약정 동의 상태
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
      } catch (error) {
        console.warn("사용자 정보를 불러올 수 없습니다. (비로그인 또는 세션 만료)");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserInfo();
  }, []);

  const isPhoneValid = /^010-\d{4}-\d{4}$/.test(phoneNumber);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isAllAgreed =
    agreements.actualOwner && agreements.beneficiary && agreements.termination;
  const isFormValid = isPhoneValid && isEmailValid && address && isAllAgreed;

  const handleNext = () => {
    if (!isFormValid) return;

    navigate(`/insurance/confirm?productId=${productId}&plan=${selectedPlan}`, {
      state: {
        phoneNumber,
        email,
        address:
          `[${addressType === "HOME" ? "집" : "직장"}] (${zipCode}) ${address} ${addressDetail} ${extraAddress}`.trim(),
      },
    });
  };

  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 추출
    const digits = e.target.value.replace(/\D/g, "");

    // 3자리 이상 입력됐을 때 010으로 시작하지 않으면 무시
    if (digits.length >= 3 && !digits.startsWith("010")) return;

    // 자동 하이픈 포맷: 010-XXXX-XXXX
    let formatted = digits;
    if (digits.length > 3 && digits.length <= 7) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else if (digits.length > 7) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }

    setPhoneNumber(formatted);
  };

  const handleAddressSearch = async () => {
    if (!addressKeyword.trim()) return;
    setIsSearchLoading(true);
    try {
      const results = await searchAddress(addressKeyword);
      setAddressResults(results);
    } catch {
      alert("주소 검색에 실패했습니다.");
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleSelectAddress = (item: AddressResult) => {
    setZipCode(item.zipNo);
    setAddress(item.roadAddr);
    setExtraAddress(item.bdNm || "");
    setAddressResults([]);
    setAddressKeyword("");
    setIsAddressVisible(false);
  };

  if (isLoading)
    return <div className="p-20 text-center font-bold">로딩 중...</div>;

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
            <div className="text-[#FF5C35] font-bold text-base">
              피보험자/계약자 정보
            </div>
            <h1 className="text-[34px] font-bold text-slate-900 leading-tight tracking-tight">
              보험 가입을 위해 고객님의 정보를 입력해주세요
            </h1>
          </header>

          <section className="space-y-12">
            <h3 className="text-2xl font-bold text-slate-900">연락처 정보</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <div className="space-y-3 text-left">
                <label className="text-sm font-bold text-slate-400 ml-1">
                  휴대폰번호
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="010-0000-0000"
                  maxLength={13}
                  className={`w-full px-6 py-5 rounded-[20px] border bg-[#F2F4F6] focus:outline-none focus:ring-2 transition-all text-slate-700 font-medium text-lg ${
                    phoneNumber && !isPhoneValid
                      ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                      : "border-slate-200 focus:ring-[#FF5C35]/20 focus:border-[#FF5C35]"
                  }`}
                />
                {phoneNumber && !isPhoneValid && (
                  <p className="text-red-400 text-sm ml-1 mt-1">010-0000-0000 형식으로 입력해주세요.</p>
                )}
              </div>

              <div className="space-y-3 text-left">
                <label className="text-sm font-bold text-slate-400 ml-1">
                  이메일 <span className="text-[#FF5C35]">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className={`w-full px-6 py-5 rounded-[20px] border bg-white focus:outline-none focus:ring-2 transition-all text-slate-700 font-medium text-lg ${
                    email && !isEmailValid
                      ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                      : "border-slate-200 focus:ring-[#FF5C35]/20 focus:border-[#FF5C35]"
                  }`}
                />
                {email && !isEmailValid && (
                  <p className="text-red-400 text-sm ml-1 mt-1">올바른 이메일 형식을 입력해주세요.</p>
                )}
                {!email && (
                  <p className="text-slate-400 text-sm ml-1 mt-1">이메일이 없습니다. 직접 입력해주세요.</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-4 text-left">
                <label className="text-sm font-bold text-slate-400 ml-1">
                  우편물 받는 곳
                </label>
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

              <div className="md:col-span-2 space-y-3 text-left">

                {/* 우편번호 + 찾기 버튼 */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={zipCode}
                    readOnly
                    placeholder="우편번호"
                    className="w-[160px] px-6 py-5 rounded-[20px] border border-slate-200 bg-[#F2F4F6] text-slate-700 font-medium text-lg focus:outline-none"
                  />
                  <button
                    onClick={() => setIsAddressVisible(!isAddressVisible)}
                    className="px-8 py-5 rounded-[20px] bg-slate-800 text-white font-bold text-lg hover:bg-slate-700 transition-all active:scale-[0.98]"
                  >
                    우편번호 찾기
                  </button>
                </div>

                {/* 주소 */}
                <input
                  type="text"
                  value={address}
                  readOnly
                  placeholder="주소"
                  className="w-full px-6 py-5 rounded-[20px] border border-slate-200 bg-[#F2F4F6] text-slate-700 font-medium text-lg focus:outline-none"
                />

                {/* 상세주소 + 참고항목 */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                    placeholder="상세주소"
                    className="flex-1 px-6 py-5 rounded-[20px] border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C35]/20 focus:border-[#FF5C35] transition-all text-slate-700 font-medium text-lg"
                  />
                  <input
                    type="text"
                    value={extraAddress}
                    readOnly
                    placeholder="참고항목"
                    className="flex-1 px-6 py-5 rounded-[20px] border border-slate-200 bg-[#F2F4F6] text-slate-400 font-medium text-lg focus:outline-none"
                  />
                </div>

                {/* 검색 패널 (우편번호 찾기 클릭 시 표시) */}
                {isAddressVisible && (
                  <div className="border border-slate-200 rounded-[20px] overflow-hidden shadow-lg bg-white">
                    {/* 검색 입력 */}
                    <div className="flex gap-2 p-4 border-b border-slate-100">
                      <input
                        type="text"
                        value={addressKeyword}
                        onChange={(e) => setAddressKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddressSearch()}
                        placeholder="예) 판교역로 166, 분당 주공, 백현동 532"
                        className="flex-1 px-4 py-3 rounded-[12px] border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-[#FF5C35]"
                      />
                      <button
                        onClick={handleAddressSearch}
                        className="px-5 py-3 rounded-[12px] bg-slate-800 text-white hover:bg-slate-700 transition-all"
                      >
                        {isSearchLoading
                          ? <Loader2 size={20} className="animate-spin" />
                          : <Search size={20} />
                        }
                      </button>
                    </div>

                    {/* 검색 결과 */}
                    {addressResults.length > 0 ? (
                      <div className="max-h-[300px] overflow-y-auto">
                        {addressResults.map((item, i) => (
                          <button
                            key={i}
                            onClick={() => handleSelectAddress(item)}
                            className="w-full text-left px-6 py-4 hover:bg-slate-50 border-b border-slate-100 last:border-none transition-colors"
                          >
                            <p className="font-semibold text-slate-800">{item.roadAddr}</p>
                            <p className="text-sm text-slate-400">[{item.zipNo}] {item.jibunAddr}</p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-sm text-slate-400 space-y-3">
                        <p className="font-semibold text-slate-600">아래와 같은 조합으로 검색하시면 더욱 정확한 결과가 검색됩니다.</p>
                        <p><span className="font-bold text-slate-700">도로명 + 건물번호</span><br/><span className="text-[#FF5C35]">예) 판교역로 166, 제주 첨단로 242</span></p>
                        <p><span className="font-bold text-slate-700">지역명(동/리) + 번지</span><br/><span className="text-[#FF5C35]">예) 백현동 532, 제주 영평동 2181</span></p>
                        <p><span className="font-bold text-slate-700">지역명(동/리) + 건물명</span><br/><span className="text-[#FF5C35]">예) 분당 주공, 연수동 주공3차</span></p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 약정 동의 섹션 (스크린샷 기반) */}
          <section className="space-y-4">
            {[
              { id: "actualOwner", label: "이 금융 거래의 실제 소유자입니다." },
              {
                id: "beneficiary",
                label: "보험수익자 지정/변경 약정에 동의합니다.",
              },
              {
                id: "termination",
                label: "통신수단을 이용한 계약해지에 동의합니다.",
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  toggleAgreement(item.id as keyof typeof agreements)
                }
                className="w-full flex items-center gap-4 px-8 py-6 rounded-[24px] border border-slate-200 hover:bg-slate-50 transition-all text-left group"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    agreements[item.id as keyof typeof agreements]
                      ? "bg-[#FF5C35]"
                      : "bg-slate-100"
                  }`}
                >
                  <Check size={20} className="text-white" strokeWidth={3} />
                </div>
                <span
                  className={`text-lg font-bold ${
                    agreements[item.id as keyof typeof agreements]
                      ? "text-slate-900"
                      : "text-slate-500"
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
