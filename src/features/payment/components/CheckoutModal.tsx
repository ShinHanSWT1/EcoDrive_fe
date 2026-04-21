import { useState } from "react";
import { createMyPaymentCodeSession } from "../payment.api";

type CheckoutModalProps = {
 isOpen: boolean;
 onClose: () => void;
};

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [isCheckoutPopupOpen, setIsCheckoutPopupOpen] = useState(false);

 if (!isOpen) return null;

 const handleCheckout = async () => {
 try {
 setIsSubmitting(true);
 console.info("[PAY] 결제코드 세션 생성 요청");

 // FE -> BE -> PAY 결제코드 세션 발급 후 Pay 결제 페이지를 새 창으로 연다.
 const session = await createMyPaymentCodeSession();
 console.info("[PAY] checkout session 생성 완료", {
 sessionToken: session.sessionToken,
 checkoutUrl: session.checkoutUrl,
 });

 const checkoutPopup = window.open(
 session.checkoutUrl,
 "EcodrivePayCheckout",
 "width=500,height=820,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes",
 );

 if (!checkoutPopup) {
 alert("팝업이 차단되어 현재 창에서 결제를 진행합니다.");
 window.location.href = session.checkoutUrl;
 return;
 }

 checkoutPopup.focus();
 setIsCheckoutPopupOpen(true);
 } catch (error) {
 console.error("[PAY] checkout session 생성 실패", error);
 alert("결제창 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.");
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" aria-hidden="true">
 <div role="dialog" aria-modal="true" aria-labelledby="checkout-modal-title" className="w-full max-w-sm p-6 bg-white rounded-2xl animate-in fade-in zoom-in-95 duration-200">
 <div className="flex items-center justify-between mb-6">
 <h2 id="checkout-modal-title" className="text-xl font-bold text-gray-800">GORANI PAY 결제</h2>
 <button onClick={onClose} aria-label="닫기" className="text-gray-400 hover:text-gray-600 transition-colors">
 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 space-y-2">
 <p className="font-semibold text-slate-800">결제 방식 안내</p>
 <p>1. <span className="font-semibold">바코드/QR</span> 탭에서 매장이 내 코드를 스캔하면 즉시 결제가 승인됩니다.</p>
 <p>2. <span className="font-semibold">QR 스캔</span> 탭에서 매장의 결제 요청 QR을 스캔하고 결제를 승인합니다.</p>
 </div>

 <button
 onClick={handleCheckout}
 disabled={isSubmitting}
 className="w-full py-4 text-lg font-bold text-white transition-colors bg-[#1A5D40] rounded-xl hover:bg-[#1A5D40]/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
 >
 {isSubmitting
 ? "결제코드 페이지 여는 중..."
 : "결제코드 페이지 열기"}
 </button>

 {isCheckoutPopupOpen && (
 <div className="mt-4 rounded-xl bg-[#1A5D40]/10 border border-[#1A5D40]/20 px-4 py-3">
 <p className="text-xs font-semibold text-[#1A5D40]">
 결제창이 새 창에서 열렸습니다. 결제 완료 후 현재 화면으로 돌아와 주세요.
 </p>
 </div>
 )}
 </div>
 </div>
 );
}
