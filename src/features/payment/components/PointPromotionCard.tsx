import { Coins, ArrowRight, Info } from 'lucide-react';
import { motion } from 'motion/react';

export function PointPromotionCard() {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[32px] p-8 text-white shadow-xl shadow-orange-100 relative overflow-hidden group cursor-pointer"
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Coins size={20} className="text-white/80" />
            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Point Benefits</span>
          </div>
          <h3 className="text-2xl font-black">포인트로 결제하고 <br className="hidden md:block" /> 최대 5% 즉시 할인 받으세요</h3>
          <p className="text-sm text-white/80 font-medium">보유하신 포인트를 결제 시 현금처럼 바로 사용 가능합니다.</p>
        </div>
        
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 flex flex-col items-center justify-center text-center min-w-[200px]">
          <div className="text-[10px] font-bold text-white/60 mb-1 uppercase">Example</div>
          <div className="text-sm font-bold line-through text-white/40">10,000원</div>
          <div className="text-2xl font-black">9,500원</div>
          <div className="mt-3 flex items-center gap-1 text-[10px] font-bold bg-white/20 px-2 py-1 rounded-lg">
            <Info size={12} /> 500P 자동 차감 적용
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-10 -left-10 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-500">
        <Coins size={200} />
      </div>
      
      <div className="absolute top-6 right-6">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-orange-500 transition-all">
          <ArrowRight size={20} />
        </div>
      </div>
    </motion.div>
  );
}
