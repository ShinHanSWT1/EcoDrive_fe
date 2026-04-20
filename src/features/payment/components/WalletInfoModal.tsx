import { X, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { PaymentWalletInfo } from "../payment.types";

type WalletInfoModalProps = {
  isOpen: boolean;
  wallet: PaymentWalletInfo | null;
  onClose: () => void;
};

const BANK_CODE_LABEL_MAP: Record<string, string> = {
  "002": "산업은행",
  "003": "기업은행",
  "004": "국민은행",
  "011": "농협은행",
  "020": "우리은행",
  "023": "SC제일은행",
  "027": "한국씨티은행",
  "031": "대구은행",
  "032": "부산은행",
  "034": "광주은행",
  "035": "제주은행",
  "037": "전북은행",
  "039": "경남은행",
  "045": "새마을금고",
  "081": "하나은행",
  "088": "신한은행",
  "089": "케이뱅크",
  "090": "카카오뱅크",
  "092": "토스뱅크",
};

function resolveBankLabel(bankCode: string | null | undefined) {
  if (!bankCode) {
    return "-";
  }
  const label = BANK_CODE_LABEL_MAP[bankCode];
  return label ? `${bankCode} (${label})` : bankCode;
}

function getWalletStatusMeta(status: string | null | undefined) {
  const normalized = (status ?? "").toUpperCase();
  if (normalized === "ACTIVE") {
    return {
      text: "ACTIVE",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }
  if (normalized === "SUSPENDED") {
    return {
      text: "SUSPENDED",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }
  if (normalized === "INACTIVE") {
    return {
      text: "INACTIVE",
      className: "bg-slate-100 text-slate-600 border-slate-200",
    };
  }
  return {
    text: status ?? "-",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  };
}

export function WalletInfoModal({ isOpen, wallet, onClose }: WalletInfoModalProps) {
  const statusMeta = getWalletStatusMeta(wallet?.status);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                  <Wallet size={18} />
                </div>
                <h3 className="text-lg font-black text-slate-900">연결 계좌 정보</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="grid grid-cols-[92px_1fr] items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">계좌번호</span>
                <span className="text-sm font-black text-slate-900">{wallet?.accountNumber ?? "-"}</span>
              </div>
              <div className="grid grid-cols-[92px_1fr] items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">예금주</span>
                <span className="text-sm font-black text-slate-900">{wallet?.ownerName ?? "-"}</span>
              </div>
              <div className="grid grid-cols-[92px_1fr] items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">은행코드</span>
                <span className="text-sm font-black text-slate-900">{resolveBankLabel(wallet?.bankCode)}</span>
              </div>
              <div className="grid grid-cols-[92px_1fr] items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">상태</span>
                <span
                  className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-black ${statusMeta.className}`}
                >
                  {statusMeta.text}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
