import React from "react";
import { House, PawPrint, MessageCircle, Store, UserRound } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  // 메뉴 구성
  const menus = [
    { name: "홈", icon: House, path: "/" },
    { name: "산책", icon: PawPrint, path: "/walk" },
    { name: "채팅", icon: MessageCircle, path: "/chat" },
    { name: "마켓", icon: Store, path: "/market" },
    { name: "프로필", icon: UserRound, path: "/profile" },
  ];

  return (
    <section className="w-full">
      <h2 className="text-xl font-semibold mb-4">NavBar</h2>
      <div className="w-full border-t border-border bg-white/80 backdrop-blur-md flex justify-around py-3 shadow-soft rounded-t-xl">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const isActive =
            menu.path === "/"
              ? pathname === "/"
              : pathname.startsWith(menu.path);
          return (
            <button
              key={menu.name}
              onClick={() => navigate(menu.path)}
              className={`flex flex-col items-center text-sm transition ${
                isActive ? "text-primary" : "text-muted"
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-1 transition ${
                  isActive ? "text-primary" : "text-muted"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {menu.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}
