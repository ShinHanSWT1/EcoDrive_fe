import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, PlusCircle } from "lucide-react";

interface ChargeModalProps {
    isOpen: boolean;
    onClose: () => void;
    // usePayment에서 만든 handleCharge 함수를 받을 프롭스
    onCharge: (amount: number) => Promise<boolean>;
}

export default function ChargeModal({ isOpen, onClose, onCharge }: ChargeModalProps) {
    const [amount, setAmount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    // 빠른 금액 추가 버튼 핸들러
    const handlePresetClick = (add: number) => {
        setAmount((prev) => prev + add);
    };

    // 충전 실행 핸들러
    const handleConfirm = async () => {
        if (amount <= 0) {
            alert("충전할 금액을 1원 이상 입력해주세요.");
            return;
        }

        setIsLoading(true);
        // 부모(PaymentHomeTab -> usePayment)로부터 받은 충전 API 연동 함수 실행
        const success = await onCharge(amount);
        setIsLoading(false);

        // 충전이 성공하면 모달 닫기 및 금액 초기화
        if (success) {
            setAmount(0);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
                    {/* 배경 딤(Dim) 처리 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* 모달 컨텐츠 */}
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl"
                    >
                        {/* 헤더 */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-900">얼마를 충전할까요?</h2>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        {/* 금액 입력 영역 */}
                        <div className="bg-slate-50 p-6 rounded-2xl mb-6 text-center border border-slate-100">
                            <input
                                type="number"
                                value={amount || ""}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="bg-transparent text-4xl font-black text-center w-full focus:outline-none text-slate-900 placeholder:text-slate-300"
                                placeholder="0"
                            />
                            <span className="text-slate-400 font-bold ml-1">원</span>
                        </div>

                        {/* 프리셋 버튼 */}
                        <div className="grid grid-cols-3 gap-2 mb-8">
                            {[10000, 30000, 50000].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handlePresetClick(val)}
                                    className="py-3 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-colors"
                                >
                                    +{val.toLocaleString()}
                                </button>
                            ))}
                        </div>

                        {/* 충전하기 버튼 */}
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                "충전 처리 중..."
                            ) : (
                                <>
                                    <PlusCircle size={20} />
                                    충전하기
                                </>
                            )}
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}