import { useEffect, useRef, useState } from 'react';
import { 
  Car, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Search,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../shared/lib/utils';
import {
  completeMyOnboarding,
  registerMyInsurance,
  registerMyVehicle,
  searchVehicleModels,
  type VehicleModelSummary,
} from '../../shared/api/onboarding';
import { fetchMe } from '../../shared/api/auth';
import type { UserMe } from '../../shared/types/api';

const MOCK_INSURANCE_COMPANIES = ['삼성화재', '현대해상', 'DB손해보험', 'KB손해보험'];

export default function Onboarding({
  onUserUpdate,
}: {
  onUserUpdate: (user: UserMe) => void;
}) {
  const [step, setStep] = useState(1);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleKeyword, setVehicleKeyword] = useState('');
  const [vehicleModels, setVehicleModels] = useState<VehicleModelSummary[]>([]);
  const [selectedVehicleModel, setSelectedVehicleModel] = useState<VehicleModelSummary | null>(null);
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const [insuranceCompanyName, setInsuranceCompanyName] = useState('삼성화재');
  const [annualPremium, setAnnualPremium] = useState('');
  const [insuranceStartedAt, setInsuranceStartedAt] = useState('');
  const [userVehicleId, setUserVehicleId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchingModels, setIsSearchingModels] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const vehicleSearchRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleSearchVehicleModels = async (keyword: string) => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      setVehicleModels([]);
      setIsSearchingModels(false);
      return;
    }

    setIsSearchingModels(true);
    setErrorMessage(null);

    try {
      const models = await searchVehicleModels(trimmedKeyword);
      setVehicleModels(models);
    } catch (error) {
      console.error(error);
      setErrorMessage('차량 모델 조회에 실패했습니다.');
    } finally {
      setIsSearchingModels(false);
    }
  };

  useEffect(() => {
    const debounce = window.setTimeout(() => {
      handleSearchVehicleModels(vehicleKeyword);
    }, 250);

    return () => window.clearTimeout(debounce);
  }, [vehicleKeyword]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!vehicleSearchRef.current?.contains(event.target as Node)) {
        setIsVehicleDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const nextStep = async () => {
    if (isSubmitting) return;

    if (!vehicleNumber.trim()) {
      setErrorMessage('차량 번호를 입력해주세요.');
      return;
    }
    if (!selectedVehicleModel) {
      setErrorMessage('차량 모델을 검색 후 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const vehicle = await registerMyVehicle({
        vehicleNumber,
        vehicleModelId: selectedVehicleModel.id,
      });

      setUserVehicleId(vehicle.userVehicleId);
      setStep((s) => s + 1);
    } catch (error) {
      console.error(error);
      setErrorMessage('차량 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const prevStep = () => setStep(s => s - 1);

  const submitInsurance = async () => {
    if (isSubmitting) return;
    if (!userVehicleId) {
      setErrorMessage('등록된 차량 정보가 없습니다.');
      return;
    }
    if (!insuranceCompanyName.trim()) {
      setErrorMessage('보험사를 선택해주세요.');
      return;
    }

    const parsedAnnualPremium = Number(annualPremium.replaceAll(',', '').replaceAll('원', '').trim());
    if (!Number.isFinite(parsedAnnualPremium) || parsedAnnualPremium <= 0) {
      setErrorMessage('연간 보험료를 숫자로 입력해주세요.');
      return;
    }
    if (!insuranceStartedAt) {
      setErrorMessage('보험 가입일을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await registerMyInsurance({
        userVehicleId,
        insuranceCompanyName,
        annualPremium: parsedAnnualPremium,
        insuranceStartedAt,
      });
      const onboardingResult = await completeMyOnboarding();
      const me = await fetchMe();
      onUserUpdate(me);

      navigate(onboardingResult.isOnboardingCompleted ? '/' : '/onboarding', {
        replace: true,
      });
    } catch (error) {
      console.error(error);
      setErrorMessage('보험 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Stepper */}
        <div className="flex justify-between items-center mb-12 px-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500",
                step >= i ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-200 text-slate-400"
              )}>
                {step > i ? <CheckCircle2 size={20} /> : i}
              </div>
              {i < 2 && (
                <div className={cn(
                  "flex-1 h-1 mx-4 rounded-full transition-all duration-500",
                  step > i ? "bg-blue-600" : "bg-slate-200"
                )}></div>
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[40px] border border-slate-200 shadow-xl p-8 md:p-12"
            >
              <div className="mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <Car size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">차량 정보를 등록해주세요</h2>
                <p className="text-slate-500 leading-relaxed">
                  먼저 차량 모델을 검색해서 선택하고, 실제 차량 번호를 입력해주세요.
                  <br />
                  <span className="text-sm text-slate-400">차량 번호는 조회용이 아니라 사용자 차량을 등록하기 위한 입력값입니다.</span>
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Vehicle Model Search</label>
                  <div ref={vehicleSearchRef} className="relative">
                    <input
                      type="text"
                      placeholder="아반떼, 쏘나타, 2023"
                      value={vehicleKeyword}
                      onFocus={() => setIsVehicleDropdownOpen(true)}
                      onChange={(event) => {
                        setVehicleKeyword(event.target.value);
                        setSelectedVehicleModel(null);
                        setIsVehicleDropdownOpen(true);
                      }}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-6 pr-14 text-base font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Search size={18} />
                    </div>

                    {isVehicleDropdownOpen && vehicleKeyword.trim() && (
                      <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                        {isSearchingModels ? (
                          <div className="px-4 py-3 text-sm text-slate-400">차량 모델을 검색 중입니다.</div>
                        ) : vehicleModels.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-slate-400">검색 결과가 없습니다.</div>
                        ) : (
                          <div className="max-h-64 overflow-y-auto py-2">
                            {vehicleModels.map((model) => {
                              const isSelected = selectedVehicleModel?.id === model.id;
                              return (
                                <button
                                  type="button"
                                  key={model.id}
                                  onClick={() => {
                                    setSelectedVehicleModel(model);
                                    setVehicleKeyword(`${model.manufacturer} ${model.modelName} ${model.modelYear}`);
                                    setVehicleModels([]);
                                    setIsVehicleDropdownOpen(false);
                                  }}
                                  className={cn(
                                    "flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-all",
                                    isSelected
                                      ? "bg-blue-50 text-blue-700"
                                      : "text-slate-700 hover:bg-slate-50",
                                  )}
                                >
                                  <div>
                                    <div className="text-sm font-bold">
                                      {model.manufacturer} {model.modelName}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      {model.modelYear} / {model.fuelType}
                                    </div>
                                  </div>
                                  {isSelected && <Check size={18} className="text-blue-600" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 ml-1">
                    등록된 차량 모델 데이터에서 검색 후 한 개를 선택해주세요.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Vehicle Number</label>
                  <input 
                    type="text" 
                    placeholder="12가 3456"
                    value={vehicleNumber}
                    onChange={(event) => setVehicleNumber(event.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-lg font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                  <p className="text-xs text-slate-400 ml-1">
                    선택한 차량 모델과 함께 사용자 차량으로 등록됩니다.
                  </p>
                </div>

                {selectedVehicleModel && (
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-200">
                      <Car size={32} className="text-slate-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-400">선택된 차량 정보</div>
                      <div className="text-lg font-bold text-slate-900">
                        {selectedVehicleModel.manufacturer} {selectedVehicleModel.modelName} ({selectedVehicleModel.modelYear})
                      </div>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <p className="text-sm font-medium text-red-500">{errorMessage}</p>
                )}

                <div className="space-y-3">
                  <button 
                    onClick={nextStep}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? '차량 등록 중...' : '다음 단계'}
                    {!isSubmitting && <ArrowRight size={18} />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
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
                      onChange={(event) => setInsuranceCompanyName(event.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none"
                    >
                      {MOCK_INSURANCE_COMPANIES.map((company) => (
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
                      placeholder="1,000,000원"
                      value={annualPremium}
                      onChange={(event) => setAnnualPremium(event.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Insurance Started Date</label>
                  <input 
                    type="date" 
                    value={insuranceStartedAt}
                    onChange={(event) => setInsuranceStartedAt(event.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                </div>

                {errorMessage && (
                  <p className="text-sm font-medium text-red-500">{errorMessage}</p>
                )}

                <div className="flex gap-4">
                  <button 
                    onClick={prevStep}
                    className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} /> 이전
                  </button>
                  <button 
                    onClick={submitInsurance}
                    disabled={isSubmitting}
                    className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? '저장 중...' : '분석 시작하기'}
                    {!isSubmitting && <ArrowRight size={18} />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
