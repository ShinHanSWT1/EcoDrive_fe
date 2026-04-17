import axios from "axios";
import type { ApiResponse } from "../../shared/types/api";
import { api } from "../../shared/api/client";
import { getMissionPageData } from "../mission/mission.api";
import { paymentMockData } from "./payment.mock";
import type { PaymentData, PaymentHistoryItem, PaymentWalletInfo } from "./payment.types";

interface PayWalletResponse {
  payUserId: number;
  payAccountId: number;
  accountNumber: string;
  bankCode: string | null;
  ownerName: string;
  balance: number;
  points: number;
  status: string;
}

interface PayTransactionResponse {
  id: number;
  transactionType?: string;
  title: string;
  date: string;
  amount: number;
  type: "pay" | "earn";
  category: string;
}

interface PayChargePrepareResponse {
  orderId: string;
  amount: number;
  expiresAt: string;
}

interface PayCheckoutSessionResponse {
  sessionToken: string;
  checkoutUrl: string;
  status: string;
  expiresAt: string;
}

export interface CouponTemplateResponse {
  id: number;
  category: string;
  name: string;
  discountLabel: string;
  validDays: number;
}

interface UserCouponResponse {
  id: number;
  templateId: number;
  name: string;
  category: string;
  discountLabel: string;
  status: string;
  issuedAt: string;
  expiresAt: string;
}

interface PayCheckoutResponse {
  paymentId: number;
  externalOrderId: string;
  status: string;
  amount: number;
  paymentType: string;
  payUserId: number;
  payAccountId: number;
  balanceAfterPayment: number;
}

interface CouponPurchaseResponse {
  issuedCoupon: UserCouponResponse;
  payment: PayCheckoutResponse;
}

export interface CouponUseTokenResponse {
  userCouponId: number;
  oneTimeCode: string;
  qrPayload: string;
  expiresAt: string;
}

export interface CouponCheckoutPrepareResponse {
  orderId: string;
  sessionToken: string;
  checkoutUrl: string;
  amount: number;
  pointAmount: number;
  finalAmount: number;
  expiresAt: string;
}

export interface CouponCheckoutConfirmResponse {
  orderId: string;
  paymentId: number;
  issuedCoupon: UserCouponResponse;
}

type CheckoutEntryMode = "IN_APP_CODE" | "MERCHANT_REDIRECT";
type CheckoutChannel = "BARCODE" | "QR" | "REDIRECT";

function isWalletNotFoundError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  return error.response?.status === 404 && error.response?.data?.code === "PAY_001";
}

function toWalletInfo(wallet: PayWalletResponse): PaymentWalletInfo {
  return {
    payUserId: wallet.payUserId,
    payAccountId: wallet.payAccountId,
    accountNumber: wallet.accountNumber,
    bankCode: wallet.bankCode,
    ownerName: wallet.ownerName,
    status: wallet.status,
  };
}

function buildCategoryLabel(category: string): string {
  switch (category) {
    case "fuel":
      return "주유/충전";
    case "parking":
      return "주차";
    case "wash":
      return "세차";
    case "maintenance":
      return "정비";
    case "store":
      return "편의점";
    case "cafe":
      return "카페";
    default:
      return category;
  }
}

function buildCouponDescription(category: string, name: string, validDays: number): string {
  const base = `${validDays}일 이내 사용 가능`;
  switch (category) {
    case "fuel":
      return `${name}은 제휴 주유소 결제 시 즉시 할인 적용됩니다. ${base}`;
    case "parking":
      return `${name}은 제휴 주차장 정산 시 자동 차감됩니다. ${base}`;
    case "wash":
      return `${name}은 세차 서비스 결제 단계에서 사용할 수 있습니다. ${base}`;
    case "maintenance":
      return `${name}은 정비 항목 결제 시 우선 적용됩니다. ${base}`;
    case "store":
      return `${name}은 제휴 편의점 결제에서 사용할 수 있습니다. ${base}`;
    case "cafe":
      return `${name}은 제휴 카페 주문 결제 시 즉시 사용 가능합니다. ${base}`;
    default:
      return `${name} 쿠폰입니다. ${base}`;
  }
}

function inferPriceFromDiscountLabel(label: string): number {
  const numeric = Number(label.replace(/[^0-9]/g, ""));
  if (Number.isNaN(numeric) || numeric <= 0) {
    return 3000;
  }
  return numeric;
}

function resolveHistoryDescription(tx: PayTransactionResponse): string {
  if (tx.transactionType === "CHARGE") {
    return "고라니페이 잔액 충전";
  }
  if (tx.transactionType === "POINT_USE") {
    return "결제 시 포인트 사용";
  }
  if (tx.transactionType === "POINT_EARN") {
    return "리워드 포인트 적립";
  }
  if (tx.transactionType === "PAYMENT") {
    if (tx.title.includes("쿠폰") || tx.category.includes("쿠폰")) {
      return "쿠폰 상품 결제";
    }
    return "일반 결제";
  }
  return "결제 내역";
}

function toHistoryItems(transactions: PayTransactionResponse[]): PaymentHistoryItem[] {
  return transactions.map((tx) => ({
    id: tx.id,
    title: tx.title,
    date: tx.date,
    amount: tx.amount,
    type: tx.type,
    category: tx.category,
    description: resolveHistoryDescription(tx),
  }));
}

function parseKoreanDate(value: string): Date | null {
  if (!value) {
    return null;
  }
  const normalized = value.replace(/\./g, "-").replace(/\s+/g, "");
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function calculateThisMonthUsage(transactions: PayTransactionResponse[]): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // 결제(PAYMENT) 거래만 집계해 "이번 달 총 사용액"으로 사용한다.
  return transactions.reduce((sum, tx) => {
    if (tx.transactionType !== "PAYMENT") {
      return sum;
    }
    const txDate = parseKoreanDate(tx.date);
    if (!txDate) {
      return sum;
    }
    if (txDate.getFullYear() !== currentYear || txDate.getMonth() !== currentMonth) {
      return sum;
    }
    return sum + tx.amount;
  }, 0);
}

function toPaymentProducts(templates: CouponTemplateResponse[]) {
  return templates.map((template, index) => {
    const price = inferPriceFromDiscountLabel(template.discountLabel);
    return {
      id: template.id,
      name: template.name,
      description: buildCouponDescription(template.category, template.name, template.validDays),
      price,
      originalPrice: price,
      category: template.category,
      image: `https://picsum.photos/seed/coupon-${template.id}-${index}/400/300`,
      discountLabel: template.discountLabel,
      validDays: template.validDays,
    };
  });
}

function toPaymentCoupons(userCoupons: UserCouponResponse[], templateMap: Map<number, CouponTemplateResponse>) {
  return userCoupons.map((coupon) => {
    const template = templateMap.get(coupon.templateId);
    const validDays = template?.validDays ?? 30;
    return {
      id: coupon.id,
      templateId: coupon.templateId,
      name: coupon.name,
      expiry: new Date(coupon.expiresAt).toLocaleDateString("ko-KR"),
      discount: coupon.discountLabel,
      category: buildCategoryLabel(coupon.category),
      description: buildCouponDescription(coupon.category, coupon.name, validDays),
      image: `https://picsum.photos/seed/owned-coupon-${coupon.templateId}/400/300`,
      used: coupon.status !== "AVAILABLE",
    };
  });
}

async function getMyWallet(): Promise<PayWalletResponse> {
  const response = await api.get<ApiResponse<PayWalletResponse>>("/pay/account");
  return response.data.data;
}

async function getMyTransactions(): Promise<PayTransactionResponse[]> {
  const response = await api.get<ApiResponse<PayTransactionResponse[]>>("/pay/transactions");
  return response.data.data;
}

export async function getCouponTemplates(): Promise<CouponTemplateResponse[]> {
  const response = await api.get<ApiResponse<CouponTemplateResponse[]>>("/coupons/templates");
  return response.data.data;
}

export async function getCouponTemplateById(templateId: number): Promise<CouponTemplateResponse> {
  const response = await api.get<ApiResponse<CouponTemplateResponse>>(`/coupons/templates/${templateId}`);
  return response.data.data;
}

async function getMyCoupons(): Promise<UserCouponResponse[]> {
  const response = await api.get<ApiResponse<UserCouponResponse[]>>("/coupons/my");
  return response.data.data;
}

export async function createMyWallet(): Promise<PayWalletResponse> {
  const response = await api.post<ApiResponse<PayWalletResponse>>("/pay/account");
  return response.data.data;
}

async function getWalletOrNull(): Promise<PayWalletResponse | null> {
  try {
    return await getMyWallet();
  } catch (error) {
    if (isWalletNotFoundError(error)) {
      return null;
    }
    throw error;
  }
}

export async function getPaymentData(): Promise<PaymentData> {
  const [missionPageData, wallet] = await Promise.all([
    getMissionPageData(),
    getWalletOrNull(),
  ]);

  let history: PaymentHistoryItem[] = [];
  let monthlyUsage = 0;
  if (wallet) {
    try {
      const transactions = await getMyTransactions();
      history = toHistoryItems(transactions);
      monthlyUsage = calculateThisMonthUsage(transactions);
    } catch (error) {
      console.error("payment 거래내역 조회 실패:", error);
    }
  }

  let templates: CouponTemplateResponse[] = [];
  let userCoupons: UserCouponResponse[] = [];
  try {
    [templates, userCoupons] = await Promise.all([
      getCouponTemplates(),
      getMyCoupons(),
    ]);
  } catch (error) {
    console.error("coupon 데이터 조회 실패:", error);
  }

  const templateMap = new Map(templates.map((template) => [template.id, template]));
  const products = templates.length > 0 ? toPaymentProducts(templates) : paymentMockData.products;
  const coupons = userCoupons.length > 0 ? toPaymentCoupons(userCoupons, templateMap) : paymentMockData.coupons;
  const categories = templates.length > 0
    ? [{ id: "all", label: "전체" }, ...Array.from(new Set(templates.map((t) => t.category))).map((category) => ({
      id: category,
      label: buildCategoryLabel(category),
    }))]
    : paymentMockData.categories;

  return {
    ...paymentMockData,
    categories,
    products,
    coupons,
    walletMissing: wallet == null,
    wallet: wallet ? toWalletInfo(wallet) : null,
    user: {
      ...paymentMockData.user,
      points: wallet?.points ?? 0,
      balance: wallet?.balance ?? 0,
      monthlyUsage,
    },
    recentHistory: history.slice(0, 4),
    allHistory: history,
    missionSummary: missionPageData.summary,
    missions: missionPageData.missions,
  };
}

export async function chargeBalance(amount: number): Promise<PayWalletResponse> {
  const response = await api.post<ApiResponse<PayWalletResponse>>("/pay/charge", { amount });
  return response.data.data;
}

export async function prepareCharge(amount: number): Promise<PayChargePrepareResponse> {
  const response = await api.post<ApiResponse<PayChargePrepareResponse>>("/pay/charge/prepare", { amount });
  return response.data.data;
}

export async function confirmCharge(paymentKey: string, orderId: string, amount: number) {
  const response = await api.post<ApiResponse<PayWalletResponse>>("/pay/charge/confirm", {
    paymentKey,
    orderId,
    amount,
  });
  return response.data.data;
}

export async function createCheckoutSession(
  title: string,
  amount: number,
  entryMode: CheckoutEntryMode = "IN_APP_CODE",
  channel: CheckoutChannel = "QR",
): Promise<PayCheckoutSessionResponse> {
  const origin = window.location.origin;
  const response = await api.post<ApiResponse<PayCheckoutSessionResponse>>("/pay/checkout/session", {
    title,
    amount,
    successUrl: `${origin}/payment`,
    failUrl: `${origin}/payment`,
    entryMode,
    channel,
  });
  return response.data.data;
}

/**
 * 사용자 결제코드(바코드/QR, QR 스캔 탭) 화면을 위한 세션을 생성한다.
 * 금액은 매장 결제요청에서 확정되므로 코드 세션 자체는 0원으로 발급한다.
 */
export async function createMyPaymentCodeSession(): Promise<PayCheckoutSessionResponse> {
  return createCheckoutSession("GORANI PAY 결제코드", 0, "IN_APP_CODE", "QR");
}

/**
 * 쿠폰 결제 준비: BE가 PAY checkout URL을 발급해 주고 FE는 해당 URL로 이동한다.
 */
export async function prepareCouponCheckout(couponTemplateId: number, pointAmount: number): Promise<CouponCheckoutPrepareResponse> {
  const origin = window.location.origin;
  const response = await api.post<ApiResponse<CouponCheckoutPrepareResponse>>("/coupons/checkout/prepare", {
    couponTemplateId,
    pointAmount,
    successUrl: `${origin}/payment/coupon/success`,
    failUrl: `${origin}/payment/coupon/fail`,
  });
  return response.data.data;
}

/**
 * PAY 결제 성공 리다이렉트 이후 BE에 쿠폰 발급 확정을 요청한다.
 */
export async function confirmCouponCheckout(orderId: string, paymentId: number, amount: number, status: string | null): Promise<CouponCheckoutConfirmResponse> {
  const response = await api.post<ApiResponse<CouponCheckoutConfirmResponse>>("/coupons/checkout/confirm", {
    orderId,
    paymentId,
    amount,
    status,
  });
  return response.data.data;
}

export async function purchaseCoupon(couponTemplateId: number, amount: number, pointAmount: number) {
  const response = await api.post<ApiResponse<CouponPurchaseResponse>>("/coupons/purchase", {
    couponTemplateId,
    amount,
    pointAmount,
  });
  return response.data.data;
}

export async function issueCouponUseToken(userCouponId: number): Promise<CouponUseTokenResponse> {
  const response = await api.post<ApiResponse<CouponUseTokenResponse>>(`/coupons/my/${userCouponId}/use-token`);
  return response.data.data;
}
