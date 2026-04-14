import React, { useEffect, useState } from "react";
import Payment from "../features/payment/Payment";

export default function PaymentPage() {
  const [payUserId, setPayUserId] = useState<number | undefined>(undefined);

  useEffect(() => {
    // fetchMe()로부터 인증된 사용자 ID 사용 (전역 상태에서 가져오기)
    // const authenticatedUser = useContext(AuthContext); // 예시
    // if (authenticatedUser?.id && Number.isInteger(authenticatedUser.id)) {
    //   setPayUserId(authenticatedUser.id);
    // }
    // 또는 localStorage를 캐시로만 사용:
    const storedUserId = localStorage.getItem("userId");
    const parsed = storedUserId ? Number(storedUserId) : NaN;
    if (Number.isInteger(parsed) && parsed > 0) {
      setPayUserId(parsed);
      }
  }, []);

  if (payUserId === undefined) {
    return <div style={{ padding: "20px" }}>유저 정보를 확인 중입니다...</div>;
  }

  return (
      <div className="payment-page-wrapper">
        <Payment payUserId={payUserId} />
      </div>
  );
}