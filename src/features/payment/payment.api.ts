import { paymentMockData } from "./payment.mock";
import type { PaymentData } from "./payment.types";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getPaymentData(): Promise<PaymentData> {
  await delay(300);
  return paymentMockData;
}
