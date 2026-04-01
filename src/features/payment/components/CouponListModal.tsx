import { useEffect, useState } from "react";
import { X, Ticket, Clock, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../../../shared/lib/utils";
import type { PaymentCouponItem } from "../payment.types";

type CouponListModalProps = {
  isOpen: boolean;
  onClose: () => void;
  coupons: PaymentCouponItem[];
  initialCategory?: string | null;
};

export default function CouponListModal({
  isOpen,
  onClose,
  coupons,
  initialCategory,
}: CouponListModalProps) {
  const [filter, setFilter] = useState<string | null>(initialCategory || null);

  useEffect(() => {
    setFilter(initialCategory || null);
  }, [initialCategory]);

  const categories = Array.from(
    new Set(coupons.map((coupon) => coupon.category).filter(Boolean)),
  ) as string[];

  const filteredCoupons = filter
    ? coupons.filter((coupon) => coupon.category === filter)
    : coupons;

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/10 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900">보유 쿠폰</h3>
                <p className="text-sm text-slate-400 mt-1">
                  카테고리별로 사용 가능한 혜택을 확인하세요.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setFilter(null)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap border",
                    filter === null
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-500 border-slate-200",
                  )}
                >
                  전체
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap border",
                      filter === category
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-500 border-slate-200",
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[55vh] overflow-y-auto pr-1">
                {filteredCoupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="rounded-3xl border border-slate-200 p-5 bg-slate-50/50"
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Ticket size={20} />
                      </div>
                      <div
                        className={cn(
                          "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest",
                          coupon.used
                            ? "bg-slate-200 text-slate-500"
                            : "bg-emerald-50 text-emerald-600",
                        )}
                      >
                        {coupon.used ? "사용 완료" : "사용 가능"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {coupon.category ? (
                        <div className="text-xs font-black text-blue-600 uppercase tracking-widest">
                          {coupon.category}
                        </div>
                      ) : null}
                      <h4 className="font-black text-slate-900">{coupon.name}</h4>
                      {coupon.discount ? (
                        <div className="text-lg font-black text-slate-900">
                          {coupon.discount}
                        </div>
                      ) : null}
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock size={14} />
                        만료일 {coupon.expiry}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-slate-900 text-white p-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-300" />
                <p className="text-sm font-medium">
                  결제 화면에서 사용 가능한 쿠폰은 자동으로 우선 적용됩니다.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
