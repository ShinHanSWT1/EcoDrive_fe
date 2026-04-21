import type {DashboardData} from "./dashboard.types";

export const dashboardMockData: DashboardData = {
    totalSavings: 155800,
    pointBalance: 12540,
    todayEarnedPoints: 1200,
    driverInsight: {
        title: "운전자 유형 인사이트",
        badge: "최근 7일 기준",
        styleLabel: "균형 주행형",
        summary: "전반적인 지표가 고르게 안정적인 주행 패턴입니다.",
        insight: "급가감속과 과속 지표가 특정 방향으로 크게 치우치지 않았습니다.",
        isDefault: false,
    },
    summaryNote: "대시보드 목업용 요약 문구",

    stats: [
        {
            id: "premium",
            label: "다음 갱신 시 예상 보험료",
            value: 854200,
            subText: "지난달 대비 예상 할인율 +1.2%p",
            tone: "dark",
        },
        {
            id: "discount",
            label: "현재 예상 할인율",
            value: "15.4%",
            subText: "현재까지 누적 예상 절감액 155,800원",
            changeText: "+2.4%",
            tone: "orange",
        },
        {
            id: "score",
            label: "안전운전 점수",
            value: "88점",
            subText: "최근 기준 점수 상승",
            changeText: "+5점",
            tone: "blue",
        },
        {
            id: "carbon",
            label: "탄소 절감 성과",
            value: "12.4kg CO₂",
            subText: "친환경 주행 실천 중",
            changeText: "+1.2kg",
            tone: "green",
        },
    ],

    savingsChart: [
        {name: "1주", savings: 132000},
        {name: "2주", savings: 138000},
        {name: "3주", savings: 145000},
        {name: "4주", savings: 154200},
    ],

    todayDrivingSummary: [
        {
            id: "distance",
            title: "총 주행거리",
            description: "12.4 km",
            statusText: "정상",
            statusTone: "normal",
            icon: "car",
        },
        {
            id: "brake",
            title: "급감속 발생",
            description: "오후 2:34 · 강남대로",
            statusText: "-2점",
            statusTone: "danger",
            icon: "trendDown",
        },
    ],

    todayMetrics: {
        totalDistance: 12.4,
        avgSpeed: 42,
        maxSpeed: 85,
        idlingTime: 12,
        ecoScore: 85,
    },

    insurancePreviews: [
        {name: "삼성화재", discountRate: 12.5, premium: 842000},
        {name: "DB손해보험", discountRate: 15.2, premium: 798000},
        {name: "KB손해보험", discountRate: 14.8, premium: 812000},
    ],
};
