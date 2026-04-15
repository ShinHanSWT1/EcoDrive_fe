// src/features/payment/components/SuccessPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../payment.api';
import { useAuth } from '../../auth/hooks/useAuth';

export function SuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { user } = useAuth();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');
    const isProcessed = useRef(false);

    useEffect(() => {
        // 유저 정보가 로드될 때까지 기다리거나, 없으면 에러 처리
        if (!user) {
            // 만약 로그인이 필수인 페이지라면 여기서 로그인 페이지로 보낼 수도 있습니다.
            return;
        }

        const paymentKey = searchParams.get('paymentKey');
        const orderId = searchParams.get('orderId');
        const amount = searchParams.get('amount');

        if (!paymentKey || !orderId || !amount) {
            setStatus('error');
            setErrorMessage('결제 정보가 누락되었습니다.');
            return;
        }

        if (isProcessed.current) return;
        isProcessed.current = true;

        const confirmCharge = async () => {
            try {
                await api.post('/pay/charge/confirm', {
                    payUserId: user.id,
                    paymentKey,
                    orderId,
                    amount: Number(amount),
                });

                setStatus('success');
                setTimeout(() => navigate('/dashboard'), 3000);
            } catch (error: any) {
                console.error('충전 승인 실패:', error);
                setStatus('error');
                setErrorMessage(error.response?.data?.message || '서버 승인 중 오류가 발생했습니다.');
            }
        };

        confirmCharge();
    }, [searchParams, navigate, user]);

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            {/* ... 기존 UI 로직 동일 ... */}
            {!user && <h2>유저 정보를 확인 중입니다...</h2>}
            {user && status === 'loading' && (
                <div>
                    <h2>🦌 결제 승인 중...</h2>
                    <p>잠시만 기다려주세요.</p>
                </div>
            )}
            {/* success, error 조건부 렌더링 동일 */}
        </div>
    );
}