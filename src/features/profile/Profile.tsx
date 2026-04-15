import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  ChevronRight,
  CreditCard,
  History,
  Leaf,
  LogOut,
  ShieldCheck,
  Ticket,
  Wallet,
} from "lucide-react";
import { cn } from "../../shared/lib/utils";
import { fetchMe } from "../../shared/api/auth";
import {
  getLatestDrivingCarbon,
  getLatestDrivingScore,
} from "../driving/driving.api";
import { getMyInsurances, type InsuranceResponse } from "../insurance/insurance.api";
import { getPaymentData } from "../payment/payment.api";

type ProfileSummary = {
  pointBalance: number;
  couponCount: number;
  safetyScore: number | null;
  carbonReductionKg: number | null;
};

type ProfileData = {
  me: Awaited<ReturnType<typeof fetchMe>>;
  summary: ProfileSummary;
  insurances: InsuranceResponse[];
};

const MANAGEMENT_ITEMS = [
  {
    to: "/insurance",
    icon: Car,
    label: "차량 · 보험 정보",
    type: "insurance" as const,
  },
  {
    to: "/report",
    icon: ShieldCheck,
    label: "주행 리포트",
    type: "report" as const,
  },
];

const ACTIVITY_ITEMS = [
  {
    to: "/payment",
    icon: CreditCard,
    label: "포인트 · 쿠폰",
    description: "적립 포인트와 보유 쿠폰 확인",
  },
  {
    to: "/mission",
    icon: Leaf,
    label: "미션 · 혜택",
    description: "진행 중 미션과 리워드 확인",
  },
  {
    to: "/report",
    icon: History,
    label: "주행 리포트 히스토리",
    description: "최근 주행 성과와 리포트 보기",
  },
];

function formatNumber(value: number | null | undefined) {
  return (value ?? 0).toLocaleString("ko-KR");
}

function formatCurrency(value: number | null | undefined) {
  return `${formatNumber(value)}원`;
}

function formatPlanType(planType: string | null | undefined) {
  if (!planType) return "미설정";

  const planLabelMap: Record<string, string> = {
    BASIC: "기본형",
    STANDARD: "표준형",
    PREMIUM: "프리미엄형",
  };

  return planLabelMap[planType] ?? planType;
}

function formatDate(dateText: string | null | undefined) {
  if (!dateText) return "미입력";

  return new Date(dateText).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getInsuranceSummaryText(insurances: InsuranceResponse[]) {
  if (insurances.length === 0) {
    return "등록된 보험 정보가 없습니다";
  }

  if (insurances.length === 1) {
    const insurance = insurances[0];
    return `${insurance.companyName} ${insurance.productName}`;
  }

  return `${insurances.length}건의 보험 계약이 연결되어 있습니다`;
}

export default function Profile({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const [data, setData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProfileData() {
      try {
        setIsLoading(true);
        setIsError(false);

        const [me, latestScore, latestCarbon, insurances, paymentData] =
          await Promise.all([
            fetchMe(),
            getLatestDrivingScore().catch(() => ({ snapshotDate: null, score: null })),
            getLatestDrivingCarbon().catch(() => ({
              snapshotDate: null,
              carbonReductionKg: null,
              rewardPoint: null,
            })),
            getMyInsurances().catch(() => []),
            getPaymentData().catch(() => null),
          ]);

        if (!active) {
          return;
        }

        setData({
          me,
          summary: {
            pointBalance: paymentData?.user.points ?? 0,
            couponCount:
              paymentData?.coupons.filter((coupon) => !coupon.used).length ?? 0,
            safetyScore: latestScore.score ?? null,
            carbonReductionKg: latestCarbon.carbonReductionKg ?? null,
          },
          insurances,
        });
      } catch (error) {
        console.error("프로필 데이터 조회 실패:", error);

        if (active) {
          setIsError(true);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadProfileData();

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500">
        마이페이지 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-600">
        마이페이지 정보를 불러오지 못했습니다.
      </div>
    );
  }

  const { me, summary, insurances } = data;
  const primaryInsurance = insurances[0] ?? null;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <section className="flex flex-col items-center text-center">
        <div className="mb-4">
          <div className="h-24 w-24 overflow-hidden rounded-[32px] border-4 border-white shadow-xl">
            <img
              src={me.profileImageUrl ?? "https://picsum.photos/seed/user/200/200"}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{me.nickname}</h2>
        <p className="text-sm text-slate-500">
          {me.email ?? "이메일 정보 없음"}
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="내 포인트"
          value={`${formatNumber(summary.pointBalance)}P`}
          icon={Wallet}
          valueClassName="text-blue-600"
        />
        <StatCard
          label="내 쿠폰"
          value={`${formatNumber(summary.couponCount)}개`}
          icon={Ticket}
          valueClassName="text-slate-900"
        />
        <StatCard
          label="안전점수"
          value={`${summary.safetyScore ?? 0}점`}
          icon={ShieldCheck}
          valueClassName="text-emerald-600"
        />
        <StatCard
          label="탄소 절감"
          value={`${(summary.carbonReductionKg ?? 0).toFixed(2)}kg`}
          icon={Leaf}
          valueClassName="text-green-600"
        />
      </section>

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="ml-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            내 정보 관리
          </h3>
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
            {MANAGEMENT_ITEMS.map((item, index) => (
              <MenuItem
                key={item.label}
                to={item.to}
                icon={item.icon}
                label={item.label}
                subLabel={
                  item.type === "insurance"
                    ? getInsuranceSummaryText(insurances)
                    : "최신 안전점수와 탄소 절감 성과 확인"
                }
                isLast={index === MANAGEMENT_ITEMS.length - 1}
              />
            ))}
          </div>
        </div>

        {primaryInsurance && (
          <div className="space-y-2">
            <h3 className="ml-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              현재 연결된 보험
            </h3>
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Insurance
                  </div>
                  <h4 className="mt-2 text-xl font-black text-slate-900">
                    {primaryInsurance.companyName}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {primaryInsurance.productName}
                  </p>
                </div>
                <Link
                  to="/insurance"
                  className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"
                >
                  자세히 보기
                  <ChevronRight size={16} />
                </Link>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <InfoTile
                  label="플랜"
                  value={formatPlanType(primaryInsurance.planType)}
                />
                <InfoTile
                  label="보험료"
                  value={formatCurrency(primaryInsurance.finalAmount)}
                />
                <InfoTile
                  label="등록일"
                  value={formatDate(primaryInsurance.createdAt)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="ml-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            활동 및 설정
          </h3>
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
            {ACTIVITY_ITEMS.map((item, index) => (
              <MenuItem
                key={item.label}
                to={item.to}
                icon={item.icon}
                label={item.label}
                subLabel={item.description}
                isLast={index === ACTIVITY_ITEMS.length - 1}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="ml-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            기타
          </h3>
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
            <button
              onClick={onLogout}
              className="group flex w-full items-center justify-between p-5 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <LogOut size={20} className="text-red-500" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-red-500">로그아웃</div>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-slate-300 transition-colors group-hover:text-slate-400"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  valueClassName,
}: {
  label: string;
  value: string;
  icon: typeof Wallet;
  valueClassName: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm sm:flex-col sm:justify-center sm:gap-2 sm:px-4">
      <div className="flex items-center gap-2 sm:flex-col sm:gap-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
          <Icon size={18} />
        </div>
        <div className="text-[10px] font-bold uppercase text-slate-400 sm:text-center">
          {label}
        </div>
      </div>
      <div className={cn("text-lg font-black sm:text-xl", valueClassName)}>
        {value}
      </div>
    </div>
  );
}

function MenuItem({
  to,
  icon: Icon,
  label,
  subLabel,
  isLast,
}: {
  to: string;
  icon: typeof Car;
  label: string;
  subLabel?: string;
  isLast?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "group flex w-full items-center justify-between p-5 transition-colors hover:bg-slate-50",
        !isLast && "border-b border-slate-50",
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
          <Icon size={20} className="text-slate-700" />
        </div>
        <div className="text-left">
          <div className="text-sm font-bold text-slate-900">{label}</div>
          {subLabel && (
            <div className="text-[11px] font-medium text-slate-400">{subLabel}</div>
          )}
        </div>
      </div>
      <ChevronRight
        size={18}
        className="text-slate-300 transition-colors group-hover:text-slate-400"
      />
    </Link>
  );
}

function InfoTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-base font-black text-slate-900">{value}</div>
    </div>
  );
}
