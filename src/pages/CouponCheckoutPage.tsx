import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCouponTemplateById, getPaymentData, prepareCouponCheckout } from "../features/payment/payment.api";
import type { CouponTemplateResponse } from "../features/payment/payment.api";

type PaymentDoneMessage = {
 type: "ECODRIVE_PAYMENT_DONE";
 flow: "insurance" | "coupon";
};

export default function CouponCheckoutPage() {
 const [searchParams] = useSearchParams();
 const navigate = useNavigate();

 const [template, setTemplate] = useState<CouponTemplateResponse | null>(null);
 const [points, setPoints] = useState(0);
 const [pointToUse, setPointToUse] = useState(0);
 const [isLoading, setIsLoading] = useState(true);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [isCheckoutPopupOpen, setIsCheckoutPopupOpen] = useState(false);

 const templateId = Number(searchParams.get("templateId"));

 useEffect(() => {
 const load = async () => {
 if (!templateId) {
 alert("쿠폰 정보가 올바르지 않습니다.");
 navigate("/payment", { replace: true });
 return;
 }

 try {
 setIsLoading(true);

 const [templateData, paymentData] = await Promise.all([
 getCouponTemplateById(templateId),
 getPaymentData(),
 ]);

 setTemplate(templateData);
 setPoints(paymentData.user.points);
 } catch (error) {
 console.error("[PAY][COUPON] 결제 페이지 초기화 실패", error);
 alert("결제 정보를 불러오지 못했습니다.");
 navigate("/payment", { replace: true });
 } finally {
 setIsLoading(false);
 }
 };

 load();
 }, [navigate, templateId]);

 useEffect(() => {
 const handlePaymentDone = (event: MessageEvent<PaymentDoneMessage>) => {
 if (event.origin !== window.location.origin) {
 return;
 }
 if (!event.data || event.data.type !== "ECODRIVE_PAYMENT_DONE") {
 return;
 }
 if (event.data.flow !== "coupon") {
 return;
 }

 console.info("[PAY][COUPON] 팝업 결제 완료 이벤트 수신, PAY 화면으로 이동합니다.");
 navigate("/payment", { replace: true });
 };

 window.addEventListener("message", handlePaymentDone);
 return () => window.removeEventListener("message", handlePaymentDone);
 }, [navigate]);

 const amount = useMemo(() => {
 if (!template) {
 return 0;
 }
 const numeric = Number(template.discountLabel.replace(/[^0-9]/g, ""));
 return Number.isNaN(numeric) || numeric <= 0 ? 3000 : numeric;
 }, [template]);

 const maxPoint = Math.min(points, amount);
 const finalAmount = Math.max(0, amount - pointToUse);

 const handleSubmit = async () => {
 if (!template) {
 return;
 }

 try {
 setIsSubmitting(true);
 console.info("[PAY][COUPON] checkout 준비 요청", {
 templateId: template.id,
 pointToUse,
 });

 const prepared = await prepareCouponCheckout(template.id, pointToUse);

 console.info("[PAY][COUPON] checkout 준비 완료", {
 orderId: prepared.orderId,
 sessionToken: prepared.sessionToken,
 checkoutUrl: prepared.checkoutUrl,
 });

 // FE -> BE(준비) -> PAY(결제 페이지) 흐름으로 새 창 이동
 const checkoutPopup = window.open(
 prepared.checkoutUrl,
 "EcodrivePayCouponCheckout",
 "width=500,height=820,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes",
 );

 if (!checkoutPopup) {
 alert("팝업이 차단되어 현재 창에서 결제를 진행합니다.");
 window.location.href = prepared.checkoutUrl;
 return;
 }

 checkoutPopup.focus();
 setIsCheckoutPopupOpen(true);
 } catch (error: any) {
 console.error("[PAY][COUPON] checkout 준비 실패", error);
 alert(error?.response?.data?.message ?? "쿠폰 결제를 시작하지 못했습니다.");
 } finally {
 setIsSubmitting(false);
 }
 };

 if (isLoading) {
 return <div className="rounded-2xl bg-white border border-slate-200 p-8">결제 정보를 불러오는 중입니다.</div>;
 }

 if (!template) {
 return null;
 }

 return (
 <div className="mx-auto max-w-2xl space-y-6">
 <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3">
 <h2 className="text-2xl font-black text-slate-900">쿠폰 결제 준비</h2>
 <p className="text-sm text-slate-500">{template.name}</p>
 </div>

 <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-slate-500">결제 예정 금액</span>
 <span className="font-black text-slate-900">{amount.toLocaleString("ko-KR")}원</span>
 </div>

 <div className="space-y-2">
 <label htmlFor="coupon-point" className="text-slate-700 font-semibold">포인트 사용</label>
 <input
 id="coupon-point"
 type="number"
 min={0}
 max={maxPoint}
 value={pointToUse}
 onChange={(event) => {
 const nextValue = Number(event.target.value || 0);
 setPointToUse(Math.min(Math.max(nextValue, 0), maxPoint));
 }}
 className="w-full rounded-xl border border-slate-200 px-3 py-2"
 />
 <p className="text-xs text-slate-500">보유 포인트: {points.toLocaleString("ko-KR")}P / 최대 사용: {maxPoint.toLocaleString("ko-KR")}P</p>
 </div>

 <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
 <span className="text-slate-700 font-semibold">최종 결제 금액</span>
 <span className="text-xl font-black text-[#1A5D40]">{finalAmount.toLocaleString("ko-KR")}원</span>
 </div>

 <button
 type="button"
 onClick={handleSubmit}
 disabled={isSubmitting}
 className="w-full rounded-2xl bg-[#1A5D40] px-4 py-3 text-white font-black disabled:opacity-60"
 >
 {isSubmitting ? "PAY 결제창 이동 중..." : "PAY 결제창으로 이동"}
 </button>
 </div>

 {isCheckoutPopupOpen && (
 <div className="rounded-2xl bg-[#1A5D40] text-white px-5 py-4 ">
 <div className="text-sm font-bold mb-1">결제창이 새 창에서 열렸습니다</div>
 <p className="text-xs text-[#1A5D40]/10 leading-relaxed text-white/80">
 새 창에서 결제를 완료한 뒤 현재 화면으로 돌아와 주세요.
 </p>
 </div>
 )}
 </div>
 );
}
