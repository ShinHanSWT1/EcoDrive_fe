import { ArrowRight, Filter, Search } from "lucide-react";
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

  const getCategoryLabel = (categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.label ?? categoryId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-2xl font-black text-slate-900">추천 결제 상품</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            지금 가장 인기 있는 상품들을 만나보세요.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
            <Search size={18} />
          </button>
          <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChangeCategory(cat.id)}
            className={cn(
              "px-6 py-2.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all duration-300 border",
              cat.id === activeCategoryId
                ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-400",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden group cursor-pointer flex flex-col"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-lg">
                {product.discountLabel} SAVE
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <div className="text-[8px] text-slate-400 font-black uppercase mb-1 tracking-widest">
                {getCategoryLabel(product.category)}
              </div>
              <h4 className="font-black text-slate-900 mb-3 text-xs line-clamp-2 flex-1">
                {product.name}
              </h4>
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <div className="text-[10px] text-slate-400 line-through font-bold">
                    {product.originalPrice.toLocaleString("ko-KR")} P
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    {product.price.toLocaleString("ko-KR")} P
                  </div>
                </div>
                <button className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
