import React from "react";

// lucide-react 아이콘 (BottomNavBar 내부에서도 사용)
import { House, PawPrint, MessageCircle, Store, UserRound } from "lucide-react";

// 🧩 UI 컴포넌트 import
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Tag from "../components/ui/Tag";
import Card from "../components/ui/Card";
import CardHorizontal from "../components/ui/CardHorizontal";
import ChatPreview from "../components/ui/ChatPreview";
import SearchBar from "../components/ui/SearchBar";
import ChatBubble from "../components/ui/ChatBubble";
import Profile from "../components/ui/Profile";
import NavBar from "../components/ui/NavBar";
import Header from "../components/ui/Header";
import CardGrid from "../components/ui/CardGrid";
import CartList from "../components/ui/CartList";
import Carousel from "../components/ui/Carousel";

export default function HomePage() {
  // 📌 하단 메뉴 데이터
  const menus = [
    { name: "홈", icon: House },
    { name: "산책", icon: PawPrint },
    { name: "채팅", icon: MessageCircle },
    { name: "마켓", icon: Store },
    { name: "프로필", icon: UserRound },
  ];
  const activeIndex = 0;

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        {/* ✅ 헤더 고정 */}
        <Header />

        {/* ✅ 스크롤 영역 */}
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-10">
          <SearchBar />
          <Tag />
          <Button />
          <Input />
          <Card />
          <CardHorizontal />
          <Carousel />
          <CardGrid />
          <CartList />
          <ChatPreview />
          <ChatBubble />
          <Profile />
        </main>

        {/* ✅ 하단 네비게이션 (같은 너비로 고정) */}
        <nav className="sticky bottom-0 w-full shadow-soft">
          <NavBar menus={menus} activeIndex={activeIndex} />
        </nav>
      </div>
    </div>
  );
}
