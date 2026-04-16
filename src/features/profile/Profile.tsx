import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Camera,
  ChevronRight,
  X,
  Leaf,
  LogOut,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { cn } from "../../shared/lib/utils";
import {
  createAvatarFallbackHandler,
  getAvatarImageSrc,
} from "../../shared/lib/avatar";
import { fetchMe, uploadMyProfileImage } from "../../shared/api/auth";
import {
  getMyVehicles,
  updateRepresentativeVehicle,
  type MyVehicleResponse,
} from "../../shared/api/onboarding";
import {
  getDrivingOverviewByVehicle,
} from "../driving/driving.api";
import { getMyInsurances, type InsuranceResponse } from "../insurance/insurance.api";
import { getPaymentData } from "../payment/payment.api";
import VehicleSelector from "../../shared/ui/VehicleSelector";
import { resolveRepresentativeVehicleId } from "../../shared/lib/vehicle";

type ProfileSummary = {
  pointBalance: number;
  couponCount: number;
  safetyScore: number | null;
  carbonReductionKg: number | null;
};

type ProfileData = {
  me: Awaited<ReturnType<typeof fetchMe>>;
  summary: ProfileSummary;
  vehicles: MyVehicleResponse[];
  insurances: InsuranceResponse[];
};

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

async function loadVehiclePerformanceSummary(userVehicleId: number | null) {
  const { score, carbon } = await getDrivingOverviewByVehicle(userVehicleId).catch(() => ({
    score: { snapshotDate: null, score: null },
    carbon: { snapshotDate: null, carbonReductionKg: null, rewardPoint: null },
  }));

  return {
    safetyScore: score.score ?? null,
    carbonReductionKg: carbon.carbonReductionKg ?? null,
  };
}

function buildActiveInsuranceByVehicleId(insurances: InsuranceResponse[]) {
  return new Map(
    insurances
      .filter((insurance) => insurance.status === "ACTIVE")
      .map((insurance) => [insurance.userVehicleId, insurance]),
  );
}

function buildProfileSummary({
  paymentData,
  performanceSummary,
}: {
  paymentData: Awaited<ReturnType<typeof getPaymentData>> | null;
  performanceSummary: Awaited<ReturnType<typeof loadVehiclePerformanceSummary>>;
}): ProfileSummary {
  return {
    pointBalance: paymentData?.user.points ?? 0,
    couponCount:
      paymentData?.coupons.filter((coupon) => !coupon.used).length ?? 0,
    safetyScore: performanceSummary.safetyScore,
    carbonReductionKg: performanceSummary.carbonReductionKg,
  };
}

function updateRepresentativeVehicles(
  vehicles: MyVehicleResponse[],
  representativeVehicleId: number,
) {
  return vehicles.map((vehicle) => ({
    ...vehicle,
    isRepresentative: vehicle.userVehicleId === representativeVehicleId,
  }));
}

function updateProfileData(
  current: ProfileData | null,
  updatedMe: Awaited<ReturnType<typeof fetchMe>>,
) {
  if (!current) {
    return current;
  }

  return {
    ...current,
    me: updatedMe,
  };
}

export default function Profile({
  onLogout,
  onUserUpdate,
}: {
  onLogout: () => void;
  onUserUpdate: (user: Awaited<ReturnType<typeof fetchMe>>) => void;
}) {
  const [data, setData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUpdatingRepresentative, setIsUpdatingRepresentative] = useState(false);
  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [profileImageUploadError, setProfileImageUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    async function loadProfileData() {
      try {
        setIsLoading(true);
        setIsError(false);

        const [me, vehicles, insurances, paymentData] =
          await Promise.all([
            fetchMe(),
            getMyVehicles().catch(() => []),
            getMyInsurances().catch(() => []),
            getPaymentData().catch(() => null),
          ]);

        const representativeVehicleId = resolveRepresentativeVehicleId(vehicles);
        const performanceSummary =
          await loadVehiclePerformanceSummary(representativeVehicleId);

        if (!active) {
          return;
        }

        setData({
          me,
          summary: buildProfileSummary({ paymentData, performanceSummary }),
          vehicles,
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

  const { me, summary, vehicles, insurances } = data;
  const representativeVehicleId = resolveRepresentativeVehicleId(vehicles);
  const activeInsuranceByVehicleId = buildActiveInsuranceByVehicleId(insurances);
  const avatarLabel = me.nickname ?? me.email ?? "U";
  const profileImageSrc = getAvatarImageSrc(me.profileImageUrl, avatarLabel);
  const handleProfileImageError = createAvatarFallbackHandler(avatarLabel);

  async function handleRepresentativeVehicleChange(nextVehicleId: number) {
    try {
      setIsUpdatingRepresentative(true);
      await updateRepresentativeVehicle(nextVehicleId);
      const performanceSummary =
        await loadVehiclePerformanceSummary(nextVehicleId);

      setData((current) => current ? {
        ...current,
        vehicles: updateRepresentativeVehicles(
          current.vehicles,
          nextVehicleId,
        ),
        summary: {
          ...current.summary,
          safetyScore: performanceSummary.safetyScore,
          carbonReductionKg: performanceSummary.carbonReductionKg,
        },
      } : current);
    } catch (error) {
      console.error("대표 차량 변경 실패:", error);
    } finally {
      setIsUpdatingRepresentative(false);
    }
  }

  async function handleProfileImageFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setIsUploadingProfileImage(true);
      setProfileImageUploadError(null);
      await uploadMyProfileImage(file);
      const updatedMe = await fetchMe();

      onUserUpdate(updatedMe);
      setData((current) => updateProfileData(current, updatedMe));
      setIsProfileImageModalOpen(false);
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      setProfileImageUploadError("프로필 이미지를 변경하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setIsUploadingProfileImage(false);
      event.target.value = "";
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <section className="flex flex-col items-center text-center">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => {
              setProfileImageUploadError(null);
              setIsProfileImageModalOpen(true);
            }}
            className="group relative overflow-hidden rounded-[32px] border-4 border-white shadow-xl"
            aria-label="프로필 이미지 크게 보기 및 변경"
          >
            <div className="h-24 w-24 overflow-hidden">
              <img
                src={profileImageSrc}
                alt="Profile"
                onError={handleProfileImageError}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 text-white transition group-hover:bg-slate-900/30">
              <Camera size={20} className="opacity-0 transition group-hover:opacity-100" />
            </div>
          </button>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{me.nickname}</h2>
        <p className="text-sm text-slate-500">
          {me.email ?? "이메일 정보 없음"}
        </p>
        <div className="mt-5 w-full max-w-sm">
          <VehicleSelector
            vehicles={vehicles}
            selectedUserVehicleId={representativeVehicleId}
            onChange={(nextVehicleId) => {
              void handleRepresentativeVehicleChange(nextVehicleId);
            }}
            label="대표 차량"
            disabled={isUpdatingRepresentative}
          />
        </div>
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
          icon={Wallet}
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
          <div className="flex items-center justify-between gap-4">
            <h3 className="ml-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              내 차량 · 보험 연결
            </h3>
            <Link
              to="/vehicles/new"
              className="inline-flex items-center rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
            >
              차량 추가
            </Link>
          </div>
          {vehicles.length > 0 ? (
            <div className="space-y-3">
              {vehicles.map((vehicle) => {
                const linkedInsurance =
                  activeInsuranceByVehicleId.get(vehicle.userVehicleId) ?? null;

                return (
                  <VehicleInsuranceCard
                    key={vehicle.userVehicleId}
                    vehicle={vehicle}
                    linkedInsurance={linkedInsurance}
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-[32px] border border-dashed border-slate-200 bg-white p-6 text-sm font-medium text-slate-500 shadow-sm">
              등록된 차량이 없습니다. 차량을 추가하고 보험까지 연결해 주세요.
            </div>
          )}
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

      {isProfileImageModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/60"
            onClick={() => {
              if (!isUploadingProfileImage) {
                setIsProfileImageModalOpen(false);
              }
            }}
            aria-label="프로필 이미지 modal 닫기"
          />
          <div className="relative z-10 w-full max-w-md rounded-[32px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">프로필 이미지</h3>
                <p className="mt-1 text-sm text-slate-500">
                  사진 형식은 JPG, PNG, WEBP를 지원하고 최대 5MB까지 업로드할 수 있습니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isUploadingProfileImage) {
                    setIsProfileImageModalOpen(false);
                  }
                }}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="닫기"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="h-48 w-48 overflow-hidden rounded-[40px] border border-slate-200 bg-slate-100 shadow-inner">
                <img
                  src={profileImageSrc}
                  alt="Profile enlarged"
                  onError={handleProfileImageError}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {profileImageUploadError ? (
              <p className="mt-4 text-sm font-medium text-red-600">
                {profileImageUploadError}
              </p>
            ) : null}

            <div className="mt-6 flex justify-end">
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  void handleProfileImageFileChange(event);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingProfileImage}
                className="inline-flex items-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isUploadingProfileImage ? "변경 중..." : "사진 변경"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}

function VehicleInsuranceCard({
  vehicle,
  linkedInsurance,
}: {
  vehicle: MyVehicleResponse;
  linkedInsurance: InsuranceResponse | null;
}) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Vehicle
          </div>
          <h4 className="mt-2 text-xl font-black text-slate-900">
            {vehicle.manufacturer} {vehicle.modelName}
          </h4>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {vehicle.modelYear}년식 · {vehicle.vehicleNumber}
          </p>
          {vehicle.isRepresentative ? (
            <span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              대표 차량
            </span>
          ) : null}
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
        <InfoTile label="연결 보험" value={linkedInsurance ? linkedInsurance.companyName : "미연결"} />
        <InfoTile
          label="상품"
          value={linkedInsurance ? linkedInsurance.productName : "등록 필요"}
        />
        <InfoTile
          label="상태"
          value={
            linkedInsurance
              ? `${formatPlanType(linkedInsurance.planType)} / 활성`
              : "보험 미등록"
          }
        />
      </div>

      {linkedInsurance && (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoTile
            label="보험료"
            value={formatCurrency(linkedInsurance.finalAmount)}
          />
          <InfoTile
            label="연결일"
            value={formatDate(linkedInsurance.createdAt)}
          />
        </div>
      )}
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
