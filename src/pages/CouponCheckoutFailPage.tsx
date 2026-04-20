import { useNavigate, useSearchParams } from "react-router-dom";

export default function CouponCheckoutFailPage() {
 const [searchParams] = useSearchParams();
 const navigate = useNavigate();
 const message = searchParams.get("message") ?? "결제가 취소되었거나 실패했습니다.";

 return (
 <div className="min-h-[70vh] flex items-center justify-center">
 <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center space-y-3">
 <h2 className="text-2xl font-black text-rose-600">결제 실패</h2>
 <p className="text-slate-600">{decodeURIComponent(message)}</p>
 <button
 type="button"
 onClick={() => navigate("/payment", { replace: true })}
 className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-white font-semibold"
 >
 PAY로 돌아가기
 </button>
 </div>
 </div>
 );
}
