import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {useDashboard} from "./useDashboard";
import DashboardOverview from "./components/DashboardOverview";
import SavingsChartCard from "./components/SavingsChartCard";
import InsuranceDiscountPreview from "./components/InsuranceDiscountPreview";
import DrivingSummaryWidget from "@/src/features/dashboard/components/DrivingSummaryWidget.tsx";
import DriverInsightCard from "@/src/features/dashboard/components/DriverInsightCard.tsx";

type RotatingMessage = {
    text: string;
    accent: string;
};

const rotatingMessages: RotatingMessage[] = [
    {
        text: "AI가 요약해준 당신의 운전 스타일을 확인해보세요",
        accent: "AI",
    },
    {
        text: "주행 데이터를 한 눈에 확인하세요",
        accent: "한 눈",
    },
    {
        text: "리워드로 혜택을 누려보세요",
        accent: "혜택",
    },
    {
        text: "안전한, 환경적인 운전 습관을 길러보세요",
        accent: "안전한, 환경적인",
    },
];

function renderMessageWithAccent(message: RotatingMessage) {
    const accentIndex = message.text.indexOf(message.accent);
    if (accentIndex < 0) {
        return message.text;
    }

    const before = message.text.slice(0, accentIndex);
    const highlighted = message.text.slice(
        accentIndex,
        accentIndex + message.accent.length,
    );
    const after = message.text.slice(accentIndex + message.accent.length);

    return (
        <>
            {before}
            <span className="text-blue-600">{highlighted}</span>
            {after}
        </>
    );
}

export default function Dashboard() {
    const {data, isLoading, isError} = useDashboard();
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setMessageIndex((previous) => (previous + 1) % rotatingMessages.length);
        }, 2800);
        return () => clearInterval(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500">
                대시보드 정보를 불러오는 중입니다.
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-600">
                대시보드 정보를 불러오지 못했습니다.
            </div>
        );
    }

    return (
        <div
            className="relative z-10 mx-auto mt-8 flex w-full max-w-[1400px] flex-col items-start space-y-4 px-4 pb-24 font-sans md:mt-10 md:px-12 lg:space-y-6">
            <div className="w-full min-h-[52px] pt-1 md:min-h-[56px] md:pt-2 pl-1 md:pl-2">
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={messageIndex}
                        initial={{opacity: 0, y: 24}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -24}}
                        transition={{duration: 0.38, ease: "easeOut"}}
                        className="text-[1.62rem] font-black tracking-tight text-slate-900 md:text-[2rem]"
                    >
                        {renderMessageWithAccent(rotatingMessages[messageIndex])}
                    </motion.h2>
                </AnimatePresence>
            </div>

            <div className="w-full">
                <DriverInsightCard insight={data.driverInsight}/>
            </div>

            <div className="w-full">
                <DashboardOverview
                    stats={data.stats.filter((s) => s.id !== "score")}
                    pointBalance={data.pointBalance}
                    todayEarnedPoints={data.todayEarnedPoints}
                />
            </div>

            <div className="flex w-full flex-col gap-6">
                <div className="w-full">
                    <SavingsChartCard chartData={data.savingsChart}/>
                </div>

                <div className="w-full">
                    <DrivingSummaryWidget
                        summaryNote={data.summaryNote}
                        todayDrivingSummary={data.todayDrivingSummary}
                        metrics={data.todayMetrics}
                    />
                </div>
            </div>

            <div className="w-full">
                <InsuranceDiscountPreview items={data.insurancePreviews}/>
            </div>
        </div>
    );
}
