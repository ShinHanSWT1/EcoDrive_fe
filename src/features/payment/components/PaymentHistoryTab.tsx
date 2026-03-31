import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  History,
  Tag,
  Ticket,
} from "lucide-react";
import { cn } from "../../../shared/lib/utils";
import type {
  PaymentCouponItem,
  PaymentHistorySummary,
  PaymentPointHistoryItem,
} from "../payment.types";

type PaymentHistoryTabProps = {
  historySummary: PaymentHistorySummary;
  coupons: PaymentCouponItem[];
  pointHistory: PaymentPointHistoryItem[];
};

export default function PaymentHistoryTab({
  historySummary,
  coupons,
  pointHistory,
}: PaymentHistoryTabProps) {
  return (
    <div className="space-y-8">
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <History size={20} className="text-blue-600" /> 3월 Pay 이용 리포트
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100">
            <div className="text-[10px] text-blue-400 font-bold uppercase mb-2">
              미션 및 주행 리워드
            </div>
            <div className="text-xl font-black text-blue-600">
              + {historySummary.earnedPoint.toLocaleString("ko-KR")} P
            </div>
            <div className="text-[10px] text-blue-500 font-bold mt-1">
              안전/탄소 절감 주행 실적 보상
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase mb-2">
              결제 및 혜택 이용
            </div>
            <div className="text-xl font-black text-slate-900">
              - {historySummary.usedPoint.toLocaleString("ko-KR")} P
            </div>
            <div className="text-[10px] text-slate-400 font-bold mt-1">
              상품 구매 및 서비스 결제
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase mb-2">
              기타 적립
            </div>
            <div className="text-xl font-black text-slate-900">
              + {historySummary.extraPoint.toLocaleString("ko-KR")} P
            </div>
            <div className="text-[10px] text-slate-400 font-bold mt-1">
              이벤트 참여 및 충전 보너스
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Tag size={20} className="text-blue-600" /> 보유 중인 결제 쿠폰
          </h3>
          <button className="text-xs text-slate-400 font-bold hover:text-blue-600 transition-colors">
            전체 보기
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-slate-50 p-5 rounded-3xl flex items-center justify-between border border-slate-100 hover:border-blue-200 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Ticket size={24} />
                </div>

                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {coupon.name}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                    <Clock size={10} /> 만료일: {coupon.expiry}
                  </div>
                </div>
              </div>

              <button className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                사용
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h4 className="font-bold text-slate-900 flex items-center gap-2">
            <History size={18} className="text-slate-400" /> 상세 결제/이용 내역
          </h4>
          <div className="flex gap-2">
            <button className="text-xs font-bold text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200">
              전체
            </button>
            <button className="text-xs font-bold text-slate-500 px-3 py-1.5 rounded-lg">
              적립
            </button>
            <button className="text-xs font-bold text-slate-500 px-3 py-1.5 rounded-lg">
              결제
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {pointHistory.map((item) => (
            <div
              key={item.id}
              className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    item.type === "earn"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-blue-50 text-blue-600",
                  )}
                >
                  {item.type === "earn" ? (
                    <ArrowUpRight size={20} />
                  ) : (
                    <ArrowDownLeft size={20} />
                  )}
                </div>

                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                    {item.date}
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "text-sm font-black",
                  item.type === "earn" ? "text-emerald-600" : "text-slate-900",
                )}
              >
                {item.amountText} P
              </div>
            </div>
          ))}
        </div>

        <button className="w-full py-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors border-t border-slate-50">
          이전 내역 더보기
        </button>
      </div>
    </div>
  );
}
