import { useLocation, useNavigate } from "react-router-dom";
import NavButton from "./NavButton";
import { api } from "../../api/api";

import logoName from "../../assets/icons/logo_name.svg";

import dashboardGrayIcon from "../../assets/icons/nav/dashbord_gray.svg";
import dashboardWhiteIcon from "../../assets/icons/nav/dashbord_white.svg";
import productGrayIcon from "../../assets/icons/nav/product_gray.svg";
import productWhiteIcon from "../../assets/icons/nav/product_white.svg";
import repairGrayIcon from "../../assets/icons/nav/repair_gray.svg";
import repairWhiteIcon from "../../assets/icons/nav/repair_white.svg";
import aiGrayIcon from "../../assets/icons/nav/ai_gray.svg";
import aiWhiteIcon from "../../assets/icons/nav/ai_white.svg";
import myGrayIcon from "../../assets/icons/nav/my_gray.svg";
import myWhiteIcon from "../../assets/icons/nav/my_white.svg";
import logoutIcon from "../../assets/icons/nav/logout.svg";

export default function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("로그아웃 API 실패:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      navigate("/login", { replace: true });
    }
  };

  const menuList = [
    {
      label: "DashBoard",
      defaultIcon: dashboardGrayIcon,
      activeIcon: dashboardWhiteIcon,
      path: "/main",
    },
    {
      label: "Product",
      defaultIcon: productGrayIcon,
      activeIcon: productWhiteIcon,
      path: "/products",
    },
    {
      label: "Repair",
      defaultIcon: repairGrayIcon,
      activeIcon: repairWhiteIcon,
      path: "/repairs",
    },
    {
      label: "AI Chat",
      defaultIcon: aiGrayIcon,
      activeIcon: aiWhiteIcon,
      path: "/chatbot",
    },
    {
      label: "My",
      defaultIcon: myGrayIcon,
      activeIcon: myWhiteIcon,
      path: "/mypage",
    },
  ];

  const getIsActive = (path: string) => {
    const pathname = location.pathname;

    if (path === "/") {
      return pathname === "/";
    }

    if (path === "/products") {
      return pathname.startsWith("/products") && !pathname.includes("/repairs");
    }

    if (path === "/repairs") {
      return pathname.startsWith("/repairs") || pathname.includes("/repairs");
    }

    return pathname.startsWith(path);
  };

  return (
    <div className="flex h-full w-[140px] flex-col justify-between pt-[30px] pb-[50px]">
      {/* 로고 + 메뉴 */}
      <div className="flex w-[140px] flex-col gap-[20px]">
        {/* 로고 */}
        <div className="flex w-full justify-center">
          <img
            src={logoName}
            alt="ORE 로고"
            className="h-auto w-[95px] object-contain"
          />
        </div>

        {/* 메뉴 */}
        <div className="flex w-full flex-col gap-[10px]">
          {menuList.map((menu) => {
            const isActive = getIsActive(menu.path);

            return (
              <NavButton
                key={menu.path}
                defaultIcon={menu.defaultIcon}
                activeIcon={menu.activeIcon}
                label={menu.label}
                active={isActive}
                onClick={() => navigate(menu.path)}
              />
            );
          })}
        </div>
      </div>

      {/* 로그아웃 */}
      <div className="w-full">
        <NavButton
          defaultIcon={logoutIcon}
          label="Log Out"
          variant="logout"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}