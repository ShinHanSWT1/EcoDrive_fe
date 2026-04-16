import { useState } from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { prepareCharge } from "../payment.api";

type ChargeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCharge?: (amount: number) => Promise<boolean>;
};

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string;

export const ChargeModal = ({ isOpen, onClose }: ChargeModalProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddAmount = (add: number) => {
    setAmount((prev) => prev + add);
  };

  const handlePayment = async () => {
    if (amount < 1000) {
      alert("최소 1,000원 이상 충전 가능합니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      const prepared = await prepareCharge(amount);
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const origin = window.location.origin;

      await tossPayments.requestPayment("카드", {
        amount: prepared.amount,
        orderId: prepared.orderId,
        orderName: "Gorani Pay 잔액 충전",
        customerName: "EcoDrive 사용자",
        successUrl: `${origin}/payment/success`,
        failUrl: `${origin}/payment/fail`,
      });

      onClose();
    } catch (error) {
      console.error("결제창 호출 실패:", error);
      alert("결제 진행 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">잔액 충전</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-500">충전할 금액</label>
          <div className="relative flex items-center border-b-2 border-gray-200 focus-within:border-blue-500 transition-colors pb-2">
            <input
              type="number"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0"
              className="w-full text-3xl font-bold text-right outline-none bg-transparent"
            />
            <span className="ml-2 text-xl font-bold text-gray-800">원</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-8">
          {[10000, 30000, 50000].map((price) => (
            <button
              key={price}
              onClick={() => handleAddAmount(price)}
              className="py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors"
            >
              +{price.toLocaleString()}원
            </button>
          ))}
        </div>

        <button
          onClick={handlePayment}
          disabled={amount === 0 || isSubmitting}
          className="w-full py-4 text-lg font-bold text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "결제창 여는 중..."
            : amount > 0
            ? `${amount.toLocaleString()}원 충전하기`
            : "금액을 입력해 주세요"}
        </button>
      </div>
    </div>
  );
};
