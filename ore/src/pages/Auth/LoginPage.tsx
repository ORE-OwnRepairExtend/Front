import googleLogo from "../../assets/google.svg";

export default function LoginPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-neutral-03">
      
      {/* 중앙 박스 */}
      <div className="relative w-[90%] max-w-[1700px] h-[80%] max-h-[860px] rounded-[50px] bg-white/30 flex flex-col items-center justify-center gap-10 backdrop-blur-sm">
        
        {/* 로고 */}
        <div className="w-[60%] max-w-[465px] h-[280px] bg-gray-02 rounded-xl flex items-center justify-center text-gray-01 text-body-r-16">
          로고
        </div>

        {/* 구글 로그인 버튼 */}
        <button className="w-[80%] max-w-[460px] h-[75px] flex items-center justify-center gap-[50px] px-[30px] py-[20px] rounded-[20px] border-[3px] border-primary-02 bg-white text-primary-02 text-[25px] font-semibold leading-[38px] shadow-sm hover:shadow-md hover:bg-neutral-04 transition">
          <img src={googleLogo} alt="google" className="w-[36px] h-[36px]" />
          Continue with Google
        </button>

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