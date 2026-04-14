import React, { useEffect, useState } from "react";
import Payment from "../features/payment/Payment";

export default function PaymentPage() {
  const [payUserId, setPayUserId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      setPayUserId(Number(storedUserId));
    } else {
      // 🚨 2. 테스트용 방어 코드: 아직 로그인 기능이 없어 유저 ID가 없다면,
      // 에러가 나지 않도록 일단 '1번 유저'로 강제 세팅합니다. (나중에 지울 부분)
      setPayUserId(1);
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