import { Wallet, Coins, TrendingUp, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AssetSummaryCardProps {
  balance: number;
  points: number;
  monthlyUsage: number;
}

export function AssetSummaryCard({ balance, points, monthlyUsage }: AssetSummaryCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Pay Balance */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 p-6 rounded-[32px] text-white shadow-xl shadow-slate-200 relative overflow-hidden group"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/10 text-white rounded-2xl">
              <Wallet size={24} />
            </div>
            <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              관리 <ChevronRight size={14} />
            </button>
          </div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">현재 Pay 잔액</div>
          <div className="text-3xl font-black">{balance.toLocaleString()}원</div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[10px] font-bold bg-blue-500 px-2 py-0.5 rounded-md">연결계좌</span>
            <span className="text-[10px] text-slate-400 font-medium">신한은행 110-***-123456</span>
          </div>
        </div>
        <Wallet size={120} className="absolute -bottom-10 -right-10 text-white/5 -rotate-12 group-hover:scale-110 transition-transform duration-500" />
      </motion.div>

      {/* Points */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Coins size={24} />
          </div>
          <button className="text-xs font-bold text-slate-400 hover:text-amber-600 transition-colors flex items-center gap-1">
            적립방법 <ChevronRight size={14} />
          </button>
        </div>
        <div className="text-xs text-slate-500 font-medium mb-1">사용 가능 포인트</div>
        <div className="text-3xl font-black text-slate-900">{points.toLocaleString()} P</div>
        <div className="mt-4 text-[11px] text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-full w-fit">
          이번 주 1,200P 적립 예정
        </div>
      </motion.div>

      {/* Monthly Usage */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="text-xs text-slate-500 font-medium mb-1">이번 달 총 사용액</div>
        <div className="text-3xl font-black text-slate-900">{monthlyUsage.toLocaleString()}원</div>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
          <span className="text-blue-600 font-bold">지난달 대비 12% 감소</span>
          <span>절약 중이에요!</span>
        </div>
      </motion.div>
    </div>
  );
}
