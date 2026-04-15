import React, { useState } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';

interface ChargeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// TODO: 발급받으신 토스페이먼츠 테스트 클라이언트 키를 입력하세요.
const TOSS_CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

export const ChargeModal: React.FC<ChargeModalProps> = ({ isOpen, onClose }) => {
    const [amount, setAmount] = useState<number>(0);

    // 모달이 닫혀있으면 렌더링하지 않음
    if (!isOpen) return null;

    // 빠른 금액 추가 버튼 핸들러
    const handleAddAmount = (add: number) => {
        setAmount((prev) => prev + add);
    };

    // 토스페이먼츠 결제창 호출 함수
    const handlePayment = async () => {
        if (amount < 1000) {
            alert('최소 1,000원 이상 충전 가능합니다.');
            return;
        }

        try {
            const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);

            await tossPayments.requestPayment('카드', {
                amount: amount,
                orderId: `ORDER_${new Date().getTime()}`, // 고유 주문번호 (실제로는 UUID 등 사용 권장)
                orderName: 'Gorani Pay 포인트 충전',
                customerName: '에코드라이브 유저', // 실제 유저 이름으로 연동 필요
                successUrl: 'http://localhost:3000/pay/success',
                failUrl: 'http://localhost:3000/pay/fail',
            });

            // 결제창이 성공적으로 호출되면 모달 닫기
            onClose();
        } catch (error) {
            console.error('결제위젯 렌더링 실패:', error);
            alert('결제창을 불러오는 데 실패했습니다.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200">

                {/* 헤더 영역 */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">포인트 충전</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* 금액 입력 영역 */}
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-500">충전할 금액</label>
                    <div className="relative flex items-center border-b-2 border-gray-200 focus-within:border-blue-500 transition-colors pb-2">
                        <input
                            type="number"
                            value={amount || ''}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            placeholder="0"
                            className="w-full text-3xl font-bold text-right outline-none bg-transparent"
                        />
                        <span className="ml-2 text-xl font-bold text-gray-800">원</span>
                    </div>
                </div>

                {/* 퀵 추가 버튼 */}
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

                {/* 액션 버튼 */}
                <button
                    onClick={handlePayment}
                    disabled={amount === 0}
                    className="w-full py-4 text-lg font-bold text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {amount > 0 ? `${amount.toLocaleString()}원 충전하기` : '금액을 입력해주세요'}
                </button>
            </div>
        </div>
    );
};