import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmCouponCheckout } from "../features/payment/payment.api";

type PaymentDoneMessage = {
 type: "ECODRIVE_PAYMENT_DONE";
 flow: "coupon";
};

export default function CouponCheckoutSuccessPage() {
 const [searchParams] = useSearchParams();
 const navigate = useNavigate();
 const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
 const [message, setMessage] = useState("");
 const [isPopupFlow, setIsPopupFlow] = useState(false);
 const isProcessed = useRef(false);

 useEffect(() => {
 const orderId = searchParams.get("orderId");
 const paymentId = Number(searchParams.get("paymentId"));
 const amount = Number(searchParams.get("amount"));
 const paymentStatus = searchParams.get("status");

 if (!orderId || Number.isNaN(paymentId) || Number.isNaN(amount)) {
 setStatus("error");
 setMessage("결제 완료 정보를 확인할 수 없습니다.");
 return;
 }

 if (isProcessed.current) {
 return;
 }
 isProcessed.current = true;

 const confirm = async () => {
 try {
 console.info("[PAY][COUPON] 결제 성공 콜백 수신", { orderId, paymentId, amount, paymentStatus });
 await confirmCouponCheckout(orderId, paymentId, amount, paymentStatus);
 setStatus("success");
 setMessage("쿠폰 발급이 완료되었습니다.");

 const openedByPopup = Boolean(window.opener && !window.opener.closed);
 setIsPopupFlow(openedByPopup);

 if (!openedByPopup) {
 setTimeout(() => navigate("/payment", { replace: true }), 2500);
 }
 } catch (error: any) {
 console.error("[PAY][COUPON] 결제 확정 실패", error);
 setStatus("error");
 setMessage(error?.response?.data?.message ?? "쿠폰 발급 확정에 실패했습니다.");
 }
 };

 confirm();
 }, [navigate, searchParams]);

 const handlePopupDone = () => {
 if (window.opener && !window.opener.closed) {
 const doneMessage: PaymentDoneMessage = {
 type: "ECODRIVE_PAYMENT_DONE",
 flow: "coupon",
 };
 window.opener.postMessage(doneMessage, window.location.origin);
 }
 window.close();
 };

 return (
 <div className="min-h-[70vh] flex items-center justify-center">
 <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center space-y-3">
 {status === "loading" ? (
 <>
 <h2 className="text-2xl font-black text-slate-900">결제 확인 중...</h2>
 <p className="text-slate-500">결제 완료 후 쿠폰 발급을 확정하고 있습니다.</p>
 </>
 ) : null}

 {status === "success" ? (
 <>
 <h2 className="text-2xl font-black text-emerald-600">결제 완료</h2>
 <p className="text-slate-600">{message}</p>
 {isPopupFlow ? (
 <>
 <p className="text-xs text-slate-500">결제 완료되었습니다. 이전 창으로 돌아가세요.</p>
 <button
 type="button"
 onClick={handlePopupDone}
 className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-white font-semibold"
 >
 확인
 </button>
 </>
 ) : (
 <p className="text-xs text-slate-400">잠시 후 PAY 화면으로 이동합니다.</p>
 )}
 </>
 ) : null}

 {status === "error" ? (
 <>
 <h2 className="text-2xl font-black text-rose-600">결제 처리 실패</h2>
 <p className="text-slate-600">{message}</p>
 <button
 type="button"
 onClick={() => navigate("/payment", { replace: true })}
 className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-white font-semibold"
 >
 PAY로 돌아가기
 </button>
 </>
 ) : null}
 </div>
 </div>
 );
}
