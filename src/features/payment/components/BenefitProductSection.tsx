import { useState } from "react";
import { ArrowRight, Filter, Search, X } from "lucide-react";
import { motion } from "motion/react";
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
    if (!selectedProduct) {
      return;
    }

    // 쿠폰 결제는 즉시 구매하지 않고 전용 결제 페이지로 이동해 포인트/최종금액을 확인 후 진행한다.
    navigate(`/payment/checkout?templateId=${selectedProduct.id}`);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div>
            <h3 className="text-2xl font-black text-slate-900">추천 결제 상품</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">
              지금 구매할 수 있는 쿠폰 상품을 확인해 보세요.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400"
            >
              <Search size={18} />
            </button>
            <button
              type="button"
              className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400"
            >
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
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
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-lg">
                  {product.discountLabel}
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
                      {product.originalPrice.toLocaleString("ko-KR")}원
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      {product.price.toLocaleString("ko-KR")}원
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">{getCategoryLabel(selectedProduct.category)}</p>
                <h4 className="text-xl font-black text-slate-900">{selectedProduct.name}</h4>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedProduct.description ?? "구매 즉시 쿠폰함에 발급되며, 유효기간 내 사용 가능합니다."}
                </p>
              </div>
              <button type="button" onClick={() => setSelectedProduct(null)} className="text-slate-400">
                <X size={18} />
              </button>
            </div>

            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-48 rounded-2xl object-cover"
              referrerPolicy="no-referrer"
            />

            <div className="rounded-2xl bg-slate-50 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">쿠폰 금액</span>
                <span className="font-bold text-slate-900">{selectedProduct.price.toLocaleString("ko-KR")}원</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">유효기간</span>
                <span className="font-bold text-slate-900">{selectedProduct.validDays ?? 30}일</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePurchaseMove}
              className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-white font-black"
            >
              구매하기
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
