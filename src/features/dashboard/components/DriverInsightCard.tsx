import { motion } from "motion/react";
import { Radar, Sparkles } from "lucide-react";
import type { DriverInsightCardData } from "../dashboard.types";

type DriverInsightCardProps = {
  insight: DriverInsightCardData;
};

export default function DriverInsightCard({ insight }: DriverInsightCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 24, delay: 0.08 }}
      className="relative overflow-hidden rounded-[40px] border border-blue-100 bg-[linear-gradient(135deg,#eff6ff_0%,#ecfeff_55%,#ffffff_100%)] p-8 shadow-[0_18px_50px_rgba(59,130,246,0.12)]"
    >
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-black tracking-wide text-blue-700 shadow-sm">
              <Sparkles size={14} />
              {insight.badge}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
              {insight.title}
            </p>
            <h3 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              {insight.styleLabel ?? "운전자 유형 분석 준비중"}
            </h3>
          </div>

          <div className="max-w-3xl space-y-3">
            {insight.summary ? (
              <p className="text-base font-bold leading-relaxed text-slate-700 md:text-lg">
                {insight.summary}
              </p>
            ) : null}
            {insight.insight ? (
              <p className="text-sm font-bold leading-relaxed text-blue-700 md:text-base">
                {insight.insight}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-slate-900 text-white shadow-lg shadow-slate-900/15 md:h-20 md:w-20">
          <Radar size={30} />
        </div>
      </div>
    </motion.section>
  );
}
