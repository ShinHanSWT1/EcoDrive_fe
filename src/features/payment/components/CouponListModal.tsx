import { useEffect, useState } from "react";
import { X, Ticket, Clock, CheckCircle2, QrCode, Barcode } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../../../shared/lib/utils";
import { issueCouponUseToken, type CouponUseTokenResponse } from "../payment.api";
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
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<PaymentCouponItem | null>(null);
  const [useToken, setUseToken] = useState<CouponUseTokenResponse | null>(null);
  const [isIssuing, setIsIssuing] = useState(false);

  useEffect(() => {
    // 모달을 열면 필터 없이 전체 쿠폰을 바로 보여준다.
    if (isOpen) {
      setFilter(null);
      setSelectedCoupon(null);
      setUseToken(null);
    }
  }, [initialCategory, isOpen]);

  const categories = Array.from(
    new Set(coupons.map((coupon) => coupon.category).filter(Boolean)),
  ) as string[];

  const filteredCoupons = filter
    ? coupons.filter((coupon) => coupon.category === filter)
    : coupons;

  const qrImageUrl = useToken
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(useToken.qrPayload)}`
    : null;
  const barcodeImageUrl = useToken
    ? `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(useToken.oneTimeCode)}&code=Code128&dpi=96`
    : null;

  const isContainImageCoupon = (couponName: string) => {
    return (
      (couponName.includes("코인") && couponName.includes("세차")) ||
      (couponName.includes("스팀") && couponName.includes("세차"))
    );
  };

  const handleIssueToken = async () => {
    if (!selectedCoupon) {
      return;
    }

    try {
      setIsIssuing(true);
      console.info("[PAY][COUPON] 사용 토큰 발급 요청", { userCouponId: selectedCoupon.id });

      const issued = await issueCouponUseToken(selectedCoupon.id);
      setUseToken(issued);

      console.info("[PAY][COUPON] 사용 토큰 발급 완료", {
        userCouponId: selectedCoupon.id,
        expiresAt: issued.expiresAt,
      });
    } catch (error: any) {
      console.error("[PAY][COUPON] 사용 토큰 발급 실패", error);
      alert(error?.response?.data?.message ?? "쿠폰 사용 코드를 발급하지 못했습니다.");
    } finally {
      setIsIssuing(false);
    }
  };

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
            className="relative w-full max-w-3xl bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900">보유 쿠폰</h3>
                <p className="text-sm text-slate-400 mt-1">
                  쿠폰을 클릭하면 상세 정보와 사용 코드를 확인할 수 있습니다.
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
                  <button
                    type="button"
                    key={coupon.id}
                    className="rounded-3xl border border-slate-200 p-5 bg-slate-50/50 text-left hover:border-blue-300"
                    onClick={() => {
                      setSelectedCoupon(coupon);
                      setUseToken(null);
                    }}
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
                  </button>
                ))}
              </div>

              <div className="rounded-2xl bg-slate-900 text-white p-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-300" />
                <p className="text-sm font-medium">
                  쿠폰 사용 시 1회용 코드가 발급되며, QR/바코드로 현장에서 스캔할 수 있습니다.
                </p>
              </div>
            </div>
          </motion.div>

          {selectedCoupon ? (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedCoupon(null)} />
              <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xl font-black text-slate-900">{selectedCoupon.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">{selectedCoupon.description ?? "제휴처에서 사용할 수 있는 쿠폰입니다."}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedCoupon(null)}>
                    <X size={18} className="text-slate-400" />
                  </button>
                </div>

                {selectedCoupon.image ? (
                  <img
                    src={selectedCoupon.image}
                    alt={selectedCoupon.name}
                    className={cn(
                      "w-full h-44 rounded-2xl",
                      isContainImageCoupon(selectedCoupon.name)
                        ? "object-contain bg-slate-50 p-4"
                        : "object-cover",
                    )}
                    referrerPolicy="no-referrer"
                  />
                ) : null}

                <div className="rounded-2xl bg-slate-50 p-4 text-sm space-y-1">
                  <p className="text-slate-700">할인 정보: <span className="font-bold">{selectedCoupon.discount ?? "-"}</span></p>
                  <p className="text-slate-700">만료일: <span className="font-bold">{selectedCoupon.expiry}</span></p>
                </div>

                {useToken ? (
                  <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-600">1회용 사용코드</p>
                    <p className="text-lg font-black text-slate-900">{useToken.oneTimeCode}</p>
                    <p className="text-xs text-slate-500">유효시간: {new Date(useToken.expiresAt).toLocaleString("ko-KR")}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-100 p-2">
                        <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><QrCode size={12} /> QR</div>
                        {qrImageUrl ? <img src={qrImageUrl} alt="쿠폰 QR" className="w-full" /> : null}
                      </div>
                      <div className="rounded-xl border border-slate-100 p-2">
                        <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Barcode size={12} /> BARCODE</div>
                        {barcodeImageUrl ? <img src={barcodeImageUrl} alt="쿠폰 바코드" className="w-full h-[220px] object-contain" /> : null}
                      </div>
                    </div>
                  </div>
                ) : null}

                <button
                  type="button"
                  disabled={selectedCoupon.used || isIssuing}
                  onClick={handleIssueToken}
                  className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-white font-black disabled:opacity-60"
                >
                  {selectedCoupon.used
                    ? "이미 사용된 쿠폰입니다"
                    : isIssuing
                      ? "사용코드 발급 중..."
                      : "사용하기"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </AnimatePresence>
  );
}
