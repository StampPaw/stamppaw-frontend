import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function NavBar({ menus = [] }) {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ "/"는 정확히 일치해야, 나머지는 startsWith로 매칭
  const activeIndex = menus.findIndex((menu) =>
    menu.path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(menu.path)
  );

  return (
    <div className="w-full border-t border-border bg-white/80 backdrop-blur-md flex justify-around py-3 shadow-soft rounded-t-xl">
      {menus.map((menu, i) => {
        const Icon = menu.icon;
        const isActive = i === activeIndex;

        return (
          <button
            key={menu.name}
            onClick={() => navigate(menu.path)}
            className={`flex flex-col items-center text-sm transition transform ${
              isActive ? "text-primary scale-105" : "text-muted"
            }`}
          >
            <Icon
              className={`w-6 h-6 mb-1 transition-all ${
                isActive ? "text-primary" : "text-muted"
              }`}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className={`${isActive ? "text-primary" : "text-muted"}`}>
              {menu.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
