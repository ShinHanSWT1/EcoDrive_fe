import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
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
  const filteredProducts =
    activeCategoryId === "all"
      ? products
      : products.filter((product) => product.category === activeCategoryId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-xl font-bold text-slate-900">생활형 혜택 결제</h3>
          <p className="text-sm text-slate-500">
            Pay 포인트로 결제 가능한 제휴 서비스입니다.
          </p>
        </div>
        <button className="text-xs font-bold text-blue-600 flex items-center gap-1">
          전체 사용처 보기 <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChangeCategory(cat.id)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all",
              cat.id === activeCategoryId
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group cursor-pointer"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
                {product.discountLabel} SAVE
              </div>
            </div>

            <div className="p-5">
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                {product.category}
              </div>
              <h4 className="font-bold text-slate-800 mb-4 line-clamp-1">
                {product.name}
              </h4>

              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs text-slate-400 line-through">
                    {product.originalPrice.toLocaleString("ko-KR")} P
                  </div>
                  <div className="text-xl font-black text-slate-900">
                    {product.price.toLocaleString("ko-KR")} P
                  </div>
                </div>

                <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-all">
                  결제하기
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
