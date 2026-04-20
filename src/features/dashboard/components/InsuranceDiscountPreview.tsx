import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import type { InsurancePreviewItem } from "../dashboard.types";
import { formatCurrency, formatPercent } from "../../../shared/lib/format";

type InsuranceDiscountPreviewProps = {
  items: InsurancePreviewItem[];
};

export default function InsuranceDiscountPreview({
  items,
}: InsuranceDiscountPreviewProps) {
  const navigate = useNavigate();

  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.4 }}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-10 rounded-[40px] shadow-[0_20px_40px_rgb(59,130,246,0.3)] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 gap-4">
        <div>
          <h3 className="font-black text-2xl md:text-3xl text-white mb-2">안전 점수 기반 <span className="text-[#FEE500]">할인 매직</span></h3>
          <p className="text-blue-100 font-medium">지금 내 점수로 받을 수 있는 최고의 혜택을 확인하세요!</p>
        </div>
        <button 
          onClick={() => navigate("/insurance")}
          className="px-6 py-3 bg-white text-blue-700 font-black rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          할인 전체 보기
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {items.length > 0 ? (
          items.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
              whileHover={{ y: -8, rotate: -2 }}
              className="p-6 bg-white rounded-[32px] border-4 border-white/20 flex flex-col justify-between shadow-xl cursor-pointer group"
            >
              <div className="mb-6">
                <div className="text-sm font-extrabold text-slate-400 mb-1">
                  {item.name}
                </div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {formatPercent(item.discountRate)} 할인
                </div>
              </div>

              <div className="pt-4 border-t-2 border-dashed border-slate-100">
                <div className="text-xs font-bold text-slate-400 mb-1">
                  다음 갱신 시 예상 보험료
                </div>
                <div className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  {formatCurrency(item.premium)}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <>
            {["삼성화재", "DB손해보험", "KB손해보험"].map((name, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-6 bg-white/10 backdrop-blur-md rounded-[32px] border border-white/20 flex flex-col justify-between shadow-xl"
              >
                <div className="mb-6">
                  <div className="text-sm font-extrabold text-blue-100 mb-1">{name}</div>
                  <div className="text-2xl font-black text-white/50">할인 준비중</div>
                </div>

                <div className="pt-4 border-t-2 border-dashed border-white/20">
                  <div className="text-xs font-bold text-blue-200/50 mb-1">
                    다음 갱신 시 예상 보험료
                  </div>
                  <div className="text-lg font-black text-white/50">--</div>
                </div>
              </motion.div>
            ))}
          </>
        )}
      </div>
    </motion.section>
  );
}
