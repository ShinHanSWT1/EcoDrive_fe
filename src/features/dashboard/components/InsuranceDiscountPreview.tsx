import type { InsurancePreviewItem } from "../dashboard.types";
import { formatCurrency, formatPercent } from "../../../shared/lib/format";

type InsuranceDiscountPreviewProps = {
  items: InsurancePreviewItem[];
};

export default function InsuranceDiscountPreview({
  items,
}: InsuranceDiscountPreviewProps) {
  return (
    <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">안전 점수 기반 보험사별 할인</h3>
        <button className="text-sm text-blue-600 font-bold">전체 보기</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.name}
            className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"
          >
            <div>
              <div className="text-xs text-slate-500 font-medium">
                {item.name}
              </div>
              <div className="text-lg font-bold text-blue-600">
                {formatPercent(item.discountRate)} 할인
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">
                다음 갱신 시 예상 보험료
              </div>
              <div className="text-sm font-bold">
                {formatCurrency(item.premium)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
