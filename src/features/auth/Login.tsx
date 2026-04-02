import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  Chrome,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { getKakaoLoginUrl } from "@/src/shared/api/auth";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();

  const handleSocialLogin = (provider: "kakao" | "google") => {
    switch (provider) {
      case "kakao":
        window.location.href = getKakaoLoginUrl();
        break;
      case "google":
        onLogin();
        navigate("/onboarding");
        break;
    }
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
          <button
            onClick={() => handleSocialLogin("kakao")}
            className="w-full bg-[#03C755] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-50 hover:bg-[#02b34c] transition-all flex items-center justify-center gap-3"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/21/Naver_Square_Logo.svg"
              alt="KaKao"
              className="w-5 h-5 invert brightness-0"
            />
            카카오로 시작하기
          </button>

          <button
            onClick={() => handleSocialLogin("google")}
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

        <div className="mt-10">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative bg-white px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Or login with email
            </span>
          </div>

          <div className="space-y-4 opacity-60 pointer-events-none">
            <div className="space-y-2">
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="이메일 주소"
                  className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none"
                  disabled
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="비밀번호"
                  className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none"
                  disabled
                />
              </div>
            </div>
          </div>
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
