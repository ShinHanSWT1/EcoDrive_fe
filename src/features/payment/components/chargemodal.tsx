import { useState } from "react";
import { X } from "lucide-react";

interface ChargeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCharge: (amount: number) => Promise<void>;
}

export default function ChargeModal({ isOpen, onClose, onCharge }: ChargeModalProps) {
    const [amount, setAmount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    // 모달이 닫혀있으면 렌더링하지 않음
    if (!isOpen) return null;

    // 빠른 금액 추가 버튼
    const handlePresetClick = (addAmount: number) => {
        setAmount((prev) => prev + addAmount);
    };

    // 충전 실행
    const handleConfirm = async () => {
        if (amount <= 0) {
            alert("충전할 금액을 1원 이상 입력해주세요.");
            return;
        }

        try {
            setIsLoading(true);
            await onCharge(amount); // 부모로부터 받은 충전 함수 실행
            setAmount(0); // 금액 초기화
            onClose(); // 성공 시 모달 닫기
        } catch (error) {
            // 에러 처리는 부모 컴포넌트에서 진행
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <X size={24} />
                </button>

                <h3 className="text-xl font-black mb-6 text-slate-800">얼마를 충전할까요?</h3>

                <div className="mb-6">
                    <p className="text-sm font-bold text-slate-500 mb-2">충전 금액</p>
                    <div className="flex items-center border-b-2 border-emerald-500 py-2">
                        <input
                            type="number"
                            value={amount || ''}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full text-4xl font-black text-right outline-none text-slate-800 bg-transparent placeholder-slate-200"
                            placeholder="0"
                        />
                        <span className="text-2xl font-bold ml-2 text-slate-800">원</span>
                    </div>
                </div>

                {/* 빠른 입력 버튼 */}
                <div className="grid grid-cols-3 gap-2 mb-8">
                    <button onClick={() => handlePresetClick(10000)} className="py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 active:scale-95 transition-all">+ 1만</button>
                    <button onClick={() => handlePresetClick(50000)} className="py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 active:scale-95 transition-all">+ 5만</button>
                    <button onClick={() => handlePresetClick(100000)} className="py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 active:scale-95 transition-all">+ 10만</button>
                </div>

                {/* 하단 충전하기 버튼 */}
                <button
                    onClick={handleConfirm}
                    disabled={isLoading || amount <= 0}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-lg shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    {isLoading ? '충전 처리 중...' : `${amount.toLocaleString()}원 충전하기`}
                </button>
            </div>
        </div>
    );
}