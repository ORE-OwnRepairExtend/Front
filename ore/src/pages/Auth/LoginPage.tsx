import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import googleLogo from "../../assets/google.svg";

type LoginResponse = {
  accessToken: string;
  user: {
    userId: string;
    email: string;
    name: string;
    profileImage: string;
  };
};

export default function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = async (idToken?: string) => {
    if (!idToken) {
      alert("idToken이 필요합니다.");
      return;
    }

    try {
      const response = await api.post<LoginResponse>("/auth/google", {
        idToken,
      });

      const { accessToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/main");
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-03 px-[50px] overflow-hidden">
      {/* 바깥 반투명 박스 */}
      <div className="w-full max-w-[1400px] h-[90vh] rounded-[30px] bg-white/30 p-[25px] relative flex flex-col items-center justify-center gap-10">
        {/* 로고 */}
        <div className="w-[60%] max-w-[465px] h-[280px] bg-gray-02 rounded-xl flex items-center justify-center text-gray-01 text-body-r-16">
          로고
        </div>

        {/* 구글 로그인 버튼 */}
        <div className="relative w-[80%] max-w-[460px] h-[75px]">
          <button
            type="button"
            className="w-full h-full flex items-center justify-center gap-[50px] px-[30px] py-[20px] rounded-[20px] border-[3px] border-primary-02 bg-white text-primary-02 text-[25px] font-semibold leading-[38px] shadow-sm hover:shadow-md hover:bg-neutral-04 transition"
          >
            <img src={googleLogo} alt="google" className="w-[36px] h-[36px]" />
            Continue with Google
          </button>

          {/* 실제 Google 로그인 버튼을 투명하게 덮어 클릭되게 함 */}
          <div className="absolute inset-0 opacity-0 cursor-pointer">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                handleGoogleLogin(credentialResponse.credential);
              }}
              onError={() => {
                alert("Google 로그인에 실패했습니다.");
              }}
              width="460"
            />
          </div>
        </div>

        <div className="absolute bottom-[35px] flex flex-col items-center">
          <span className="text-title-main text-primary-02">
            Own Repair Extend
          </span>
          <span className="text-body-r-15 text-gray-01">
            더 오래, 더 제대로
          </span>
        </div>
      </div>
    </div>
  );
}