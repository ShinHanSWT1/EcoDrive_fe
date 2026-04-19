import { useState } from "react";
import { ArrowRight, Filter, Search, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../shared/lib/utils";
import type { PaymentCategory, PaymentProduct } from "../payment.types";

type BenefitProductSectionProps = {
  categories: PaymentCategory[];
  products: PaymentProduct[];
  activeCategoryId: string;
  onChangeCategory: (categoryId: string) => void;
};

export default function BenefitProductSection({
  categories,
  products,
  activeCategoryId,
  onChangeCategory,
}: BenefitProductSectionProps) {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<PaymentProduct | null>(null);

  const filteredProducts =
    activeCategoryId === "all"
      ? products
      : products.filter((product) => product.category === activeCategoryId);

  const getCategoryLabel = (categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.label ?? categoryId;

  const handlePurchaseMove = () => {
    if (!selectedProduct) return;
    navigate(`/payment/checkout?templateId=${selectedProduct.id}`);
  };

  return (
    <>
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between px-2">
          <div>
            <h3 className="text-3xl font-black text-slate-900 flex items-center gap-2">
              놓칠 수 없는 특가 상품 <Sparkles className="text-[#FEE500]" fill="#FEE500" size={24} />
            </h3>
            <p className="text-sm text-slate-500 font-bold mt-2">
              열심히 모은 포인트로 깜짝 놀랄 쿠폰들을 득템해 보세요!
            </p>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.05 }} type="button" className="w-12 h-12 bg-white border-2 border-slate-100 rounded-[20px] flex items-center justify-center text-slate-500 shadow-sm hover:border-blue-200 hover:text-blue-600 transition-colors">
              <Search size={22} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} type="button" className="w-12 h-12 bg-white border-2 border-slate-100 rounded-[20px] flex items-center justify-center text-slate-500 shadow-sm hover:border-blue-200 hover:text-blue-600 transition-colors">
              <Filter size={22} />
            </motion.button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChangeCategory(cat.id)}
              className={cn(
                "px-6 py-3 rounded-full text-sm font-black whitespace-nowrap transition-all duration-300 border-2",
                cat.id === activeCategoryId
                  ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-300"
                  : "bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                key={product.id}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-[40px] border-4 border-white shadow-[0_15px_40px_rgb(0,0,0,0.06)] overflow-hidden group cursor-pointer flex flex-col relative"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative aspect-square flex items-center justify-center overflow-hidden bg-slate-50 m-2 rounded-[32px]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={cn(
                      "w-full h-full transition-transform duration-700 group-hover:scale-110",
                      product.name.includes("SK에너지") || product.name.includes("SK 에너지") 
                        ? "object-contain p-6 scale-90" 
                        : "object-cover"
                    )}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-[11px] font-black tracking-widest px-3 py-1.5 rounded-full shadow-lg z-10">
                    {product.discountLabel}
                  </div>
                </div>

                <div className="p-6 pt-4 flex-1 flex flex-col">
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase mb-2 tracking-widest bg-slate-50 inline-block px-2 py-1 rounded w-fit">
                    {getCategoryLabel(product.category)}
                  </div>
                  <h4 className="font-black text-slate-900 mb-4 text-base leading-snug line-clamp-2 flex-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <div className="text-xs text-slate-400 line-through font-bold">
                        {product.originalPrice.toLocaleString("ko-KR")}원
                      </div>
                      <div className="text-xl font-black text-slate-900 tracking-tight">
                        {product.price.toLocaleString("ko-KR")}원
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center group-hover:bg-[#FEE500] group-hover:text-slate-900 group-hover:shadow-[0_10px_20px_rgb(254,229,0,0.4)] transition-all"
                    >
                      <ArrowRight size={20} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-lg rounded-[48px] bg-white p-8 space-y-6 shadow-2xl border-4 border-white"
            >
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div>
                  <p className="text-xs text-slate-400 font-extrabold tracking-widest uppercase mb-1 bg-slate-50 inline-block px-2 py-0.5 rounded-md">{getCategoryLabel(selectedProduct.category)}</p>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">{selectedProduct.name}</h4>
                  <p className="text-sm text-slate-500 mt-2 font-bold leading-relaxed bg-[#F8FAFC] p-3 rounded-2xl">
                    {selectedProduct.description ?? "구매 즉시 쿠폰함에 신비하게 쏙! 발급되며, 유효기간 내에 언제든 사용 가능합니다. ✨"}
                  </p>
                </div>
                <button type="button" onClick={() => setSelectedProduct(null)} className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="rounded-[32px] overflow-hidden shadow-inner border border-slate-100 bg-slate-50 flex items-center justify-center">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className={cn(
                    "w-full h-56 transition-transform duration-700 hover:scale-105",
                    selectedProduct.name.includes("SK에너지") || selectedProduct.name.includes("SK 에너지")
                      ? "object-contain p-6 scale-90"
                      : "object-cover"
                  )}
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="rounded-3xl bg-slate-50 p-6 space-y-3 border border-slate-100 border-dashed">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-bold">쿠폰 마법 금액</span>
                  <span className="font-black text-slate-900 text-lg">{selectedProduct.price.toLocaleString("ko-KR")}원</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-bold">마법 유효기간</span>
                  <span className="font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{selectedProduct.validDays ?? 30}일 남음</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handlePurchaseMove}
                className="w-full rounded-[24px] bg-blue-600 px-4 py-5 text-white font-black text-lg shadow-[0_15px_30px_rgb(37,99,235,0.3)] hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                교환하기 <ArrowRight size={20} />
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
