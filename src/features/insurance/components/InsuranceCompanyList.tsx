import { ExternalLink, HelpCircle, Info } from "lucide-react";
import { motion } from "motion/react";
import type { InsuranceCompany } from "../insurance.types";
import { formatCurrency, formatPercent } from "../../../shared/lib/format";

type InsuranceCompanyListProps = {
  companies: InsuranceCompany[];
  safetyScore: number;
};

export default function InsuranceCompanyList({
  companies,
  safetyScore,
}: InsuranceCompanyListProps) {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">보험사별 예상 혜택 비교</h3>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <HelpCircle size={14} /> 내 점수 기준 ({safetyScore}점)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companies.map((company) => (
          <motion.div
            key={company.name}
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-600">
                  {company.logo}
                </div>

                <div>
                  <div className="font-bold">{company.name}</div>
                  <div className="flex gap-1 mt-1">
                    {company.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">
                  최대 할인율
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {formatPercent(company.discountRate)}
                </div>
              </div>
            </div>

            <div className="mb-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
              <p className="text-[11px] text-blue-700 font-bold flex items-center gap-1.5">
                <Info size={12} /> {company.reason}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">
                  다음 갱신 시 예상 보험료
                </div>
                <div className="text-lg font-bold">
                  {formatCurrency(company.expectedPremium)}
                </div>
              </div>

              <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <ExternalLink size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
