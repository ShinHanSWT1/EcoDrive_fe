import { useState } from 'react';
import { 
  Car, 
  ShieldCheck, 
  Database, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../shared/lib/utils';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

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
                  차량번호를 입력하면 제휴 차량 데이터로 차량 정보를 확인할 수 있어요.
                  <br />
                  <span className="text-sm text-slate-400">정확한 보험료 계산을 위해 차량 기본 정보를 자동으로 조회합니다.</span>
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Vehicle Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="12가 3456"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-lg font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200">
                      <Search size={20} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 ml-1">
                    조회된 차량 정보는 보험료 계산과 할인 조건 확인에 활용됩니다.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-200">
                    <Car size={32} className="text-slate-300" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-400">조회된 차량 정보</div>
                    <div className="text-lg font-bold text-slate-900">현대 아반떼 (CN7) 2023</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={nextStep}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    다음 단계 <ArrowRight size={18} />
                  </button>
                  <button 
                    onClick={() => navigate('/')}
                    className="w-full bg-transparent text-slate-400 py-2 rounded-2xl font-bold hover:text-slate-600 transition-all text-sm"
                  >
                    나중에 입력하기
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
                    <select className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none">
                      <option>삼성화재</option>
                      <option>현대해상</option>
                      <option>DB손해보험</option>
                      <option>KB손해보험</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Annual Premium</label>
                    <input 
                      type="text" 
                      placeholder="1,000,000원"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Renewal Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={prevStep}
                    className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} /> 이전
                  </button>
                  <button 
                    onClick={() => navigate('/')}
                    className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    분석 시작하기 <ArrowRight size={18} />
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
