import { Coins, CreditCard, Plus, ShoppingBag, Ticket, TrendingUp, Wallet, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface AssetSummaryCardProps {
 balance: number;
 points: number;
 monthlyUsage: number;
 chargeDisabled?: boolean;
 walletInfoDisabled?: boolean;
 onOpenWalletInfo: () => void;
 onOpenCoupons: () => void;
 onChargeClick: () => void;
 onCheckoutClick: () => void;
}

export default function AssetSummaryCard({
 balance,
 points,
 monthlyUsage,
 chargeDisabled = false,
 walletInfoDisabled = false,
 onOpenWalletInfo,
 onOpenCoupons,
 onChargeClick,
 onCheckoutClick,
}: AssetSummaryCardProps) {
 const totalBalance = balance + points;

 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="bg-white p-8 rounded-[40px] text-slate-900 relative overflow-hidden group h-full flex flex-col justify-between border-[0.5px] border-[#A0C878]"
 >
 <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/40 rounded-full blur-3xl pointer-events-none"></div>

 <div className="relative z-10">
 <div className="flex justify-between items-start mb-8">
 <button
 type="button"
 onClick={onOpenWalletInfo}
 disabled={walletInfoDisabled}
 className="p-3 bg-slate-100/50 text-slate-900 rounded-2xl border border-slate-200 max-w-fit hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
 aria-label="연결 계좌 정보 열기"
 >
 <Wallet size={28} />
 </button>
 <div className="text-right">
 <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
 이번 달 쏠쏠한 사용액 <Sparkles size={12} className="text-amber-500" />
 </div>
 <div className="text-xl font-black flex items-center justify-end gap-1">
 {monthlyUsage.toLocaleString("ko-KR")}원
 <TrendingUp size={18} className="text-indigo-600" />
 </div>
 </div>
 </div>

 <div className="space-y-1.5 mb-8">
 <div className="text-xs text-slate-700 font-black uppercase tracking-wider">
 현재 빵빵한 PAY 총 잔액
 </div>
 <div className="text-5xl font-black tracking-tight drop- text-slate-900">
 {totalBalance.toLocaleString("ko-KR")}
 <span className="text-3xl ml-1 font-bold">원</span>
 </div>

 <div className="flex flex-wrap items-center gap-3 mt-6">
 <div className="px-4 py-2.5 bg-[#A0C878]/10 rounded-2xl border border-[#A0C878]/30 flex items-center gap-2">
 <Coins size={18} className="text-amber-500" />
 <span className="text-sm font-black">{points.toLocaleString("ko-KR")}P</span>
 </div>
 <div className="px-4 py-2.5 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-2">
 <CreditCard size={18} className="text-blue-600" />
 <span className="text-sm font-black">{balance.toLocaleString("ko-KR")}원</span>
 </div>
 </div>
 </div>
 </div>

 <div className="relative z-10 grid grid-cols-3 gap-3">
 <motion.button
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 onClick={onChargeClick}
 disabled={chargeDisabled}
 className="bg-slate-900 text-white rounded-2xl px-4 py-3 font-black text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
 >
 <Plus size={16} />
 충전 꽉꽉
 </motion.button>
 <motion.button
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 onClick={onCheckoutClick}
 disabled={chargeDisabled}
 className="bg-blue-600 text-white rounded-2xl px-4 py-3 font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
 >
 <ShoppingBag size={16} />
 바로 결제
 </motion.button>
 <motion.button
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 onClick={onOpenCoupons}
 className="bg-white text-slate-900 rounded-2xl px-4 py-3 font-black text-sm flex items-center justify-center gap-2 border-[0.5px] border-slate-100 hover:border-blue-200 transition-colors"
 >
 <Ticket size={16} className="text-blue-500" />
 쿠폰함
 </motion.button>
 </div>
 </motion.div>
 );
}
