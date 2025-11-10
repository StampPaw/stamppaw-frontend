import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { House, PawPrint, MessageCircle, Store, UserRound } from "lucide-react";

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
  const navigate = useNavigate();

  // ✅ 현재 선택된 태그 상태 추가
  const [selectedTag, setSelectedTag] = useState("전체");

  // 📌 하단 메뉴 데이터
  const menus = [
    { name: "홈", icon: House },
    { name: "산책", icon: PawPrint },
    { name: "채팅", icon: MessageCircle },
    { name: "마켓", icon: Store },
    { name: "프로필", icon: UserRound },
  ];
  const activeIndex = 0;

  // ✅ 태그 클릭 핸들러
  const handleTagClick = (tag) => {
    setSelectedTag(tag); // 색상 반응을 위해 상태 변경

    if (tag === "동행 모집") {
      navigate("/companion");
    } else if (tag === "전체") {
      navigate("/"); // ✅ 전체 클릭 시 홈으로 이동
    }
  };

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-10">
          <SearchBar />

          {/* ✅ 선택 상태를 전달 */}
          <Tag selectedTag={selectedTag} onTagClick={handleTagClick} />

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

        <nav className="sticky bottom-0 w-full shadow-soft">
          <NavBar menus={menus} activeIndex={activeIndex} />
        </nav>
      </div>
    </div>
  );
}
