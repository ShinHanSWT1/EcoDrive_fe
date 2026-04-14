import {
  ShieldCheck,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { getKakaoLoginUrl } from "@/src/shared/api/auth";

export default function Login() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  const errorMessage =
    error === "email_required"
      ? "카카오 이메일 정보 제공이 필요합니다. 이메일 제공에 동의한 뒤 다시 로그인해주세요."
      : error === "oauth_login_failed"
        ? "소셜 로그인 처리에 실패했습니다. 다시 시도해주세요."
        : null;

  const handleSocialLogin = () => {
    window.location.href = getKakaoLoginUrl();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200/50 p-8 md:p-12"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 mb-6">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            EcoDrive Payback
          </h2>
          <p className="text-slate-500 text-center text-sm">
            소셜 계정으로 1분 만에 시작하기 <br />
            차량 및 보험 정보를 등록하면 맞춤 절감액을 확인합니다.
          </p>
        </div>

        <div className="space-y-4">
          {errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleSocialLogin}
            className="w-full bg-[#FEE500] text-[#191600] py-4 rounded-2xl font-bold shadow-lg shadow-yellow-100 hover:bg-[#f7dc00] transition-all flex items-center justify-center gap-3"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#191600] text-xs font-black text-[#FEE500]">
              K
            </span>
            카카오로 시작하기
          </button>

          <button
            className="w-full bg-white border border-slate-200 text-slate-900 py-4 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            구글로 시작하기
          </button>
        </div>

        <p className="mt-10 text-center text-xs text-slate-400 font-medium">
          로그인 시 EcoDrive Payback의{" "}
          <button className="text-blue-600 font-bold hover:underline">
            이용약관
          </button>{" "}
          및{" "}
          <button className="text-blue-600 font-bold hover:underline">
            개인정보처리방침
          </button>
          에 동의하게 됩니다.
        </p>
      </motion.div>
    </div>
  );
}
