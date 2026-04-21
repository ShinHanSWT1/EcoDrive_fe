import {
 Area,
 AreaChart,
 CartesianGrid,
 ReferenceLine,
 ResponsiveContainer,
 Tooltip,
 XAxis,
 YAxis,
} from "recharts";
import { Activity, ArrowDownRight, ArrowUpRight, LineChart } from "lucide-react";
import { cn } from "../../../shared/lib/utils";
import type { ScoreTrendItem } from "../driving.types";

const DEFAULT_MIN_SCORE = 60;
const DEFAULT_MAX_SCORE = 100;
const CHART_PADDING = 4;
const DISCOUNT_REFERENCE_SCORE = 85;

interface DailyScoreTrendChartProps {
 trendData: ScoreTrendItem[];
 currentScore?: number | null;
 currentScoreDate?: string | null;
}

export function DailyScoreTrendChart({
 trendData,
 currentScore,
 currentScoreDate,
}: DailyScoreTrendChartProps) {
 const chartSummary = buildChartSummary(trendData);

 return (
 <div className="flex h-full flex-col rounded-3xl bg-white ">
 <div className="px-6 pb-5 pt-6">
 <div className="flex min-h-[52px] items-start justify-between gap-4">
 <div className="flex min-w-0 items-center gap-2.5">
 <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
   <LineChart size={16} />
 </div>
 <div>
   <h3 className="text-[19px] font-bold text-slate-900">일별 점수 추이</h3>
   <p className="mt-1 text-[15px] font-medium text-slate-900">
     선택한 월 기준으로 일별 점수 흐름을 확인합니다.
   </p>
 </div>
 </div>
 </div>

 {chartSummary.hasData ? (
 <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
 <SummaryStat
   label="최고점"
 value={`${chartSummary.highestItem?.score ?? "--"}점`}
 description={
 chartSummary.highestItem
 ? formatHeaderDate(chartSummary.highestItem.fullDate)
 : "-"
 }
 tone="up"
 />
 <SummaryStat
 label="최저점"
 value={`${chartSummary.lowestItem?.score ?? "--"}점`}
 description={
 chartSummary.lowestItem
 ? formatHeaderDate(chartSummary.lowestItem.fullDate)
 : "-"
 }
 tone="down"
 />
 <SummaryStat
 label="현재 점수"
 value={`${currentScore ?? "--"}점`}
 description={currentScoreDate ? formatHeaderDate(currentScoreDate) : "-"}
 tone="neutral"
 />
 </div>
 ) : null}
 </div>

 <div className="min-h-0 flex-1 px-4 pb-4 pt-4 sm:px-5">
 {chartSummary.hasData ? (
 <div className="h-full min-h-[250px] rounded-2xl bg-slate-50/70 px-3 py-3 sm:px-4">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart
 data={trendData}
 margin={{ top: 8, right: 8, left: -18, bottom: 2 }}
 >
 <defs>
 <linearGradient id="dailyScoreFill" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor="#1A5D40" stopOpacity={0.18} />
 <stop offset="100%" stopColor="#1A5D40" stopOpacity={0.02} />
 </linearGradient>
 </defs>

 <CartesianGrid
 vertical={false}
 stroke="#e2e8f0"
 strokeDasharray="3 3"
 />

 <XAxis
 dataKey="fullDate"
 tickLine={false}
 axisLine={false}
 interval="preserveStartEnd"
 minTickGap={24}
 tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
 tickFormatter={formatAxisDate}
 />

 <YAxis
 domain={[chartSummary.yMin, chartSummary.yMax]}
 tickCount={4}
 tickLine={false}
 axisLine={false}
 width={34}
 tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
 tickFormatter={(value) => `${value}`}
 />

 <Tooltip
 cursor={{ stroke: "#bfdbfe", strokeWidth: 1, strokeDasharray: "4 4" }}
 content={<ScoreTooltip />}
 />

 <ReferenceLine
 y={DISCOUNT_REFERENCE_SCORE}
 stroke="#cbd5e1"
 strokeDasharray="4 4"
 ifOverflow="extendDomain"
 label={{
 position: "insideTopRight",
 value: `${DISCOUNT_REFERENCE_SCORE}점`,
 fill: "#94a3b8",
 fontSize: 10,
 fontWeight: 700,
 }}
 />

 <Area
 type="monotone"
 dataKey="score"
 stroke="#1A5D40"
 strokeWidth={2.5}
 fill="url(#dailyScoreFill)"
 activeDot={{
 r: 5,
 strokeWidth: 3,
 stroke: "#ffffff",
 fill: "#1A5D40",
 }}
 dot={(props) => {
 const { cx, cy, index } = props;
 const isLast = index === chartSummary.lastIndex;
 if (!isLast || cx == null || cy == null) {
 return null;
 }
 return (
 <circle
 cx={cx}
 cy={cy}
 r={4}
 fill="#1A5D40"
 stroke="#ffffff"
 strokeWidth={2}
 />
 );
 }}
 />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 ) : (
 <div className="flex h-full min-h-[240px] items-center justify-center rounded-2xl bg-slate-50/80 p-6 text-center">
 <div>
 <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900 ">
 <Activity size={18} />
 </div>
 <div className="mt-4 text-sm font-semibold text-slate-700">
 선택한 월에는 일별 점수 추이가 없습니다
 </div>
 <div className="mt-1 text-xs font-medium text-slate-900">
 다른 월을 선택해 다시 확인해 보세요.
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 );
}


function buildChartSummary(trendData: ScoreTrendItem[]) {
 if (trendData.length === 0) {
 return {
 hasData: false,
 highestItem: null,
 lowestItem: null,
 yMin: DEFAULT_MIN_SCORE,
 yMax: DEFAULT_MAX_SCORE,
 lastIndex: -1,
 };
 }

 const highestItem = trendData.reduce((best, item) =>
 item.score > best.score ? item : best,
 );
 const lowestItem = trendData.reduce((best, item) =>
 item.score < best.score ? item : best,
 );
 const scoreValues = trendData.map((item) => item.score);
 const paddedMin = Math.max(0, Math.min(...scoreValues) - CHART_PADDING);
 const paddedMax = Math.min(100, Math.max(...scoreValues) + CHART_PADDING);

 return {
 hasData: true,
 highestItem,
 lowestItem,
 yMin: Math.min(paddedMin, DISCOUNT_REFERENCE_SCORE),
 yMax: Math.max(paddedMax, DISCOUNT_REFERENCE_SCORE),
 lastIndex: trendData.length - 1,
 };
}

function SummaryStat({
  label,
  value,
  description,
  tone,
}: {
  label: string;
  value: string;
  description: string;
  tone: "up" | "down" | "neutral";
}) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <div className="text-[13px] font-bold uppercase tracking-[0.14em] text-slate-900">
        {label}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[21px] font-black text-slate-900">{value}</span>
        {tone === "up" ? (
          <span className="rounded-full bg-emerald-50 p-1 text-emerald-600">
            <ArrowUpRight size={12} />
          </span>
        ) : null}
        {tone === "down" ? (
          <span className="rounded-full bg-rose-50 p-1 text-rose-600">
            <ArrowDownRight size={12} />
          </span>
        ) : null}
      </div>
      <div className="mt-1 text-[15px] font-medium text-slate-900">{description}</div>
    </div>
  );
}

function ScoreTooltip({
 active,
 payload,
 label,
}: {
 active?: boolean;
 payload?: Array<{ value?: number; payload?: ScoreTrendItem }>;
 label?: string;
}) {
 if (!active || !payload?.length) {
 return null;
 }

 const item = payload[0]?.payload;
 const score = payload[0]?.value;

 return (
 <div className="rounded-2xl bg-white px-3.5 py-3 -200/60">
 <div className="text-[11px] font-bold text-slate-900">
 {formatTooltipDate(label ?? item?.fullDate ?? "")}
 </div>
 <div className="mt-2 flex items-end gap-1">
 <span className="text-xl font-black text-slate-900">{score ?? "--"}</span>
 <span className="pb-0.5 text-[11px] font-bold text-slate-900">점</span>
 </div>
 <div
 className={cn(
 "mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold",
 (item?.deltaFromPrevious ?? 0) >= 0
 ? "bg-emerald-50 text-slate-900"
 : "bg-rose-50 text-slate-900",
 )}
 >
 {(item?.deltaFromPrevious ?? 0) >= 0 ? "+" : ""}
 {item?.deltaFromPrevious ?? 0}점
 </div>
 </div>
 );
}

function formatAxisDate(dateValue: string) {
 const [, month, day] = dateValue.split("-").map(Number);
 if (!month || !day) {
 return dateValue;
 }
 return `${month}.${String(day).padStart(2, "0")}`;
}

function formatHeaderDate(dateValue: string) {
 const [, month, day] = dateValue.split("-").map(Number);
 if (!month || !day) {
 return dateValue;
 }
 return `${month}월 ${day}일`;
}

function formatTooltipDate(dateValue: string) {
 const [year, month, day] = dateValue.split("-").map(Number);
 if (!year || !month || !day) {
 return dateValue;
 }
 return `${year}년 ${month}월 ${day}일`;
}
