import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMe } from "../../shared/api/auth";
import { removeAccessToken, setAccessToken } from "../../shared/lib/auth";

export default function OAuthCallback({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("로그인 처리 중입니다...");
  const executed = useRef(false);

  useEffect(() => {
    const processLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");
      const storedToken = localStorage.getItem("accessToken");

      if (executed.current) return;
      executed.current = true;

      console.log("href:", window.location.href);
      console.log("queryToken:", accessToken);
      console.log("storedToken:", storedToken);

      if (!accessToken) {
        console.log("토큰이 없음: {}", accessToken);
        setMessage("토큰이 없습니다.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        setAccessToken(accessToken);

        const me = await fetchMe();
        console.log("로그인 사용자", me);

        onLogin();
        navigate("/onboarding", { replace: true });
      } catch (error) {
        console.error(error);
        removeAccessToken();
        setMessage("로그인 처리에 실패했습니다.");
        navigate("/login", { replace: true });
      }
    };

    processLogin();
  }, [navigate, onLogin]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-slate-600 font-medium">{message}</p>
    </div>
  );
}
