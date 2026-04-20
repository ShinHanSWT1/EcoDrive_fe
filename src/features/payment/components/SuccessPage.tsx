import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmCharge } from "../payment.api";

export function SuccessPage() {
 const [searchParams] = useSearchParams();
 const navigate = useNavigate();

 const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
 const [errorMessage, setErrorMessage] = useState("");
 const isProcessed = useRef(false);

 useEffect(() => {
 const paymentKey = searchParams.get("paymentKey");
 const orderId = searchParams.get("orderId");
 const amount = searchParams.get("amount");

 if (!paymentKey || !orderId || !amount) {
 setStatus("error");
 setErrorMessage("결제 정보가 올바르지 않습니다.");
 return;
 }

 if (isProcessed.current) return;
 isProcessed.current = true;

 const confirm = async () => {
 try {
 await confirmCharge(paymentKey, orderId, Number(amount));
 setStatus("success");
 setTimeout(() => navigate("/payment"), 3000);
 } catch (error: any) {
 console.error("충전 승인 실패:", error);
 setStatus("error");
 setErrorMessage(error.response?.data?.message || "서버 확인 중 오류가 발생했습니다.");
 }
 };

 confirm();
 }, [navigate, searchParams]);

 return (
 <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
 {status === "loading" && (
 <div className="text-center">
 <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#1A5D40] rounded-full border-t-transparent animate-spin" />
 <h2 className="text-2xl font-bold text-slate-800">결제 승인 중...</h2>
 <p className="mt-2 text-slate-500">지갑 충전을 반영하고 있습니다.</p>
 </div>
 )}

 {status === "success" && (
 <div className="text-center animate-in fade-in zoom-in duration-300">
 <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-[#1A5D40]/20 rounded-full">
 <svg className="w-10 h-10 text-[#1A5D40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
 </svg>
 </div>
 <h2 className="mb-2 text-3xl font-bold text-slate-800">충전 완료</h2>
 <p className="mb-8 text-lg text-slate-600">
 지갑에 <span className="font-bold text-[#1A5D40]">{Number(searchParams.get("amount")).toLocaleString()}원</span>이 충전되었습니다.
 </p>
 <p className="text-sm text-slate-400">잠시 후 Pay 화면으로 이동합니다.</p>
 </div>
 )}

 {status === "error" && (
 <div className="text-center">
 <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full">
 <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
 </svg>
 </div>
 <h2 className="mb-2 text-2xl font-bold text-slate-800">충전 실패</h2>
 <p className="mb-6 text-slate-600">{errorMessage}</p>
 <button
 onClick={() => navigate("/payment")}
 className="px-6 py-3 font-semibold text-white transition-colors bg-slate-800 rounded-xl hover:bg-slate-700"
 >
 돌아가기
 </button>
 </div>
 )}
 </div>
 );
}
