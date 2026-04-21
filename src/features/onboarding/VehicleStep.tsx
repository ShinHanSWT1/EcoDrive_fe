import { Car, ArrowRight, Search, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../shared/lib/utils';
import type { VehicleModelSummary } from '../../shared/api/onboarding';
import { Vehicle3DViewer } from '../driving/components/Vehicle3DViewer';

interface VehicleStepProps {
 vehicleKeyword: string;
 vehicleModels: VehicleModelSummary[];
 selectedVehicleModel: VehicleModelSummary | null;
 vehicleNumber: string;
 isVehicleDropdownOpen: boolean;
 isSearchingModels: boolean;
 isSubmitting: boolean;
 errorMessage: string | null;
 vehicleSearchRef: React.RefObject<HTMLDivElement | null>;
 onVehicleKeywordFocus: () => void;
 onVehicleKeywordChange: (value: string) => void;
 onVehicleModelSelect: (model: VehicleModelSummary) => void;
 onVehicleNumberChange: (value: string) => void;
 onNextStep: () => void;
}

export default function VehicleStep({
 vehicleKeyword,
 vehicleModels,
 selectedVehicleModel,
 vehicleNumber,
 isVehicleDropdownOpen,
 isSearchingModels,
 isSubmitting,
 errorMessage,
 vehicleSearchRef,
 onVehicleKeywordFocus,
 onVehicleKeywordChange,
 onVehicleModelSelect,
 onVehicleNumberChange,
 onNextStep,
}: VehicleStepProps) {
 return (
 <motion.div
 key="step1"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="bg-white rounded-[40px] border border-slate-200 p-8 md:p-12"
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
 onFocus={onVehicleKeywordFocus}
 onChange={(event) => onVehicleKeywordChange(event.target.value)}
 className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-6 pr-14 text-base font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
 />
 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
 <Search size={18} />
 </div>

 {isVehicleDropdownOpen && vehicleKeyword.trim() && (
 <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white ">
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
 onClick={() => onVehicleModelSelect(model)}
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
 onChange={(event) => onVehicleNumberChange(event.target.value)}
 className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-lg font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
 />
 <p className="text-xs text-slate-400 ml-1">
 선택한 차량 모델과 함께 사용자 차량으로 등록됩니다.
 </p>
 </div>

 {selectedVehicleModel && (
 (() => {
 const isAvante = selectedVehicleModel.modelName?.includes("아반떼") || selectedVehicleModel.modelName?.toUpperCase().includes("AVANTE");

 if (isAvante) {
 return (
 <div className="space-y-4">
 <div className="flex items-center gap-3 ml-2">
 <div className="w-8 h-8 md:w-10 md:h-10 bg-[#143D60] rounded-xl flex items-center justify-center text-[#A0C878]">
 <Car size={20} />
 </div>
 <div>
 <div className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Selected Model</div>
 <div className="text-lg md:text-xl font-black text-slate-900">
 {selectedVehicleModel.manufacturer} {selectedVehicleModel.modelName} ({selectedVehicleModel.modelYear})
 </div>
 </div>
 </div>
 <Vehicle3DViewer hideTitle={true} />
 </div>
 );
 }

 return (
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
 );
 })()
 )}

 {errorMessage && (
 <p className="text-sm font-medium text-red-500">{errorMessage}</p>
 )}

 <div className="space-y-3">
 <button
 onClick={onNextStep}
 disabled={isSubmitting}
 className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold -200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
 >
 {isSubmitting ? '차량 등록 중...' : '다음 단계'}
 {!isSubmitting && <ArrowRight size={18} />}
 </button>
 </div>
 </div>
 </motion.div>
 );
}
