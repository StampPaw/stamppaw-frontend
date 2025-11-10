import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { House, PawPrint, MessageCircle, Store, UserRound } from "lucide-react";

// ✅ 공통 컴포넌트
import Header from "./components/ui/Header";
import NavBar from "./components/ui/NavBar";
import useKakaoLoaderOnce from "./hooks/useKakaoLoaderOnce";

// ✅ 주요 페이지
import HomePage from "./pages/HomePage";
import WalkPage from "./pages/walk/WalkPage";
import WalkRecordPage from "./pages/walk/WalkRecordPage";

// ✅ 반려동물 관련 페이지
import CompanionListPage from "./pages/CompanionListPage";
import CompanionWritePage from "./pages/CompanionWritePage";
import CompanionDetailPage from "./pages/CompanionDetailPage";
import ChatRoomPage from "./pages/ChatRoomPage";
import ChatListPage from "./pages/ChatListPage";

export default function App() {
  useKakaoLoaderOnce({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
    libraries: ["clusterer", "drawing", "services"],
  });

  return (
    <Router>
      {/* 전체 컨테이너 */}
      <div className="relative min-h-screen bg-white text-text font-sans overflow-hidden">
        {/* ✅ Header */}
        <header className="fixed top-0 left-0 w-full z-50">
          <div className="w-full sm:max-w-[500px] mx-auto">
            <Header />
          </div>
        </header>

        {/* ✅ 메인 컨텐츠 (라우팅 영역) */}
        <main className="relative z-0 pt-[60px] pb-[80px]">
          {/* padding으로 Header/NavBar 영역 확보 */}
          <div className="w-full sm:max-w-[500px] mx-auto">
            <AppLayout />
          </div>
        </main>

        {/* ✅ NavBar */}
        <nav className="fixed bottom-0 left-0 w-full z-50">
          <div className="w-full sm:max-w-[500px] mx-auto shadow-soft">
            <AppNavBar />
          </div>
        </nav>
      </div>
    </Router>
  );
}

// 📌 내부 라우팅 설정
function AppLayout() {
  const location = useLocation();

  return (
    <Routes>
      {/* ✅ 홈 */}
      <Route path="/" element={<HomePage />} />

      {/* ✅ 산책 관련 */}
      <Route path="/walk" element={<WalkPage />} />
      <Route path="/walk/:walkId" element={<WalkRecordPage />} />

      {/* ✅ 반려동물 관련 */}
      <Route path="/companion" element={<CompanionListPage />} />
      <Route path="/companion/write" element={<CompanionWritePage />} />
      <Route path="/companion/:id" element={<CompanionDetailPage />} />

      {/* ✅ 채팅 관련 */}
      <Route path="/chat" element={<ChatListPage />} />
      <Route path="/chat/:roomId" element={<ChatRoomPage />} />
    </Routes>
  );
}

// 📌 하단 네비게이션
function AppNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    { name: "홈", icon: House, path: "/" },
    { name: "산책", icon: PawPrint, path: "/walk" },
    { name: "마켓", icon: Store, path: "/market" },
    { name: "채팅", icon: MessageCircle, path: "/chat" },
    { name: "프로필", icon: UserRound, path: "/profile" },
  ];

  return <NavBar menus={menus} />;
}
