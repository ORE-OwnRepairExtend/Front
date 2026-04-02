import { useLocation, useNavigate } from "react-router-dom";
import NavButton from "./NavButton";

export default function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuList = [
    {
      label: "DashBoard",
      defaultIcon: "/icons/nav/dashbord_gray.svg",
      activeIcon: "/icons/nav/dashbord_white.svg",
      path: "/",
    },
    {
      label: "Product",
      defaultIcon: "/icons/nav/product_gray.svg",
      activeIcon: "/icons/nav/product_white.svg",
      path: "/products",
    },
    {
      label: "Repair",
      defaultIcon: "/icons/nav/repair_gray.svg",
      activeIcon: "/icons/nav/repair_white.svg",
      path: "/repairs",
    },
    {
      label: "AI Chat",
      defaultIcon: "/icons/nav/ai_gray.svg",
      activeIcon: "/icons/nav/ai_white.svg",
      path: "/chatbot",
    },
    {
      label: "My",
      defaultIcon: "/icons/nav/my_gray.svg",
      activeIcon: "/icons/nav/my_white.svg",
      path: "/mypage",
    },
  ];

  return (
    <div className="flex h-full w-[140px] pt-[30px] pb-[80px] flex-col justify-between">
      {/* 로고 + 메뉴 */}
      <div
        className="
        flex w-[140px] flex-col gap-[30px]
      "
      >
        {/* 로고 */}
        <div className="flex h-[80px] items-center justify-center rounded-[10px] bg-gray-02">
          로고
        </div>

        {/* 메뉴 */}
        <div className="flex w-full flex-col gap-[20px]">
          {menuList.map((menu) => {
            const isActive =
              menu.path === "/repairs"
                ? location.pathname.includes("/repairs")
                : location.pathname === menu.path;
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
          defaultIcon={"/icons/nav/logout.svg"}
          label="Log Out"
          variant="logout"
          onClick={() => {
            console.log("logout");
          }}
        />
      </div>
    </div>
  );
}
