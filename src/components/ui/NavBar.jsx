import React from "react";
import { House, PawPrint, MessageCircle, Store, UserRound } from "lucide-react";

export default function NavBar() {
  // 메뉴 구성
  const menus = [
    { name: "홈", icon: House },
    { name: "산책", icon: PawPrint },
    { name: "채팅", icon: MessageCircle },
    { name: "마켓", icon: Store },
    { name: "프로필", icon: UserRound },
  ];

  const activeIndex = 0; // 예시: 홈 탭 활성화

  return (
    <section className="w-full">
      <h2 className="text-xl font-semibold mb-4">NavBar</h2>
      <div className="w-full border-t border-border bg-white/80 backdrop-blur-md flex justify-around py-3 shadow-soft rounded-t-xl">
        {menus.map((menu, i) => {
          const Icon = menu.icon;
          const isActive = i === activeIndex;
          return (
            <button
              key={menu.name}
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
