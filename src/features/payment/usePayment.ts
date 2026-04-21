import { useEffect, useState } from "react";
import { chargeBalance, createMyWallet, getPaymentData } from "./payment.api";
import type { PaymentData } from "./payment.types";

export function usePayment() {
 const [data, setData] = useState<PaymentData | null>(null);
 const [isLoading, setIsLoading] = useState(true);
 const [isError, setIsError] = useState(false);
 const [isCreatingWallet, setIsCreatingWallet] = useState(false);

 const fetchData = async () => {
 try {
 setIsLoading(true);
 setIsError(false);

 const result = await getPaymentData();
 setData(result);
 } catch (error) {
 console.error("payment 데이터 조회 실패:", error);
 setIsError(true);
 } finally {
 setIsLoading(false);
 }
 };

 useEffect(() => {
 let mounted = true;

 async function fetchDataWithMountGuard() {
 try {
 setIsLoading(true);
 setIsError(false);

 const result = await getPaymentData();
 if (mounted) {
 setData(result);
 }
 } catch (error) {
 console.error("payment 데이터 조회 실패:", error);
 if (mounted) {
 setIsError(true);
 }
 } finally {
 if (mounted) {
 setIsLoading(false);
 }
 }
 }

 fetchDataWithMountGuard();

 return () => {
 mounted = false;
 };
 }, []);

 const handleCharge = async (amount: number) => {
 try {
 if (data?.walletMissing) {
 alert("계좌를 먼저 생성해 주세요.");
 return false;
 }

 const updatedWallet = await chargeBalance(amount);

 setData((prev) => {
 if (!prev) return prev;
 return {
 ...prev,
 user: {
 ...prev.user,
 balance: updatedWallet.balance,
 },
 };
 });

 return true;
 } catch (error) {
 console.error("충전 요청 중 오류 발생:", error);
 alert("충전에 실패했습니다. 다시 시도해 주세요.");
 return false;
 }
 };

 const handleCreateWallet = async () => {
 try {
 setIsCreatingWallet(true);
 const wallet = await createMyWallet();

 setData((prev) => {
 if (!prev) return prev;
 return {
 ...prev,
 walletMissing: false,
 wallet: {
 payUserId: wallet.payUserId,
 payAccountId: wallet.payAccountId,
 accountNumber: wallet.accountNumber,
 bankCode: wallet.bankCode,
 ownerName: wallet.ownerName,
 status: wallet.status,
 },
 user: {
 ...prev.user,
 balance: wallet.balance,
 points: wallet.points,
 },
 };
 });

 return true;
 } catch (error) {
 console.error("계좌 생성 요청 중 오류 발생:", error);
 alert("계좌 생성에 실패했습니다. 다시 시도해 주세요.");
 return false;
 } finally {
 setIsCreatingWallet(false);
 }
 };

 return {
 data,
 isLoading,
 isError,
 isCreatingWallet,
 handleCharge,
 handleCreateWallet,
 refreshPaymentData: fetchData,
 };
}
