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
import Market from "./pages/market/Market";
import ProductList from "./pages/market/ProductList";
import ProductDetail from "./pages/market/ProductDetail";
import CartList from "./pages/market/CartList";

// ✅ 반려동물 관련 페이지
import CompanionListPage from "./pages/companion/CompanionListPage";
import CompanionWritePage from "./pages/companion/CompanionWritePage";
import CompanionDetailPage from "./pages/companion/CompanionDetailPage";
import ChatRoomPage from "./pages/companion/ChatRoomPage";
import ChatListPage from "./pages/companion/ChatListPage";

// ✅ 로그인/회원가입 페이지
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

// ✅ 프로필 관련 페이지
import ProfilePage from "./pages/Profile/ProfilePage";
import ProfileEditPage from "./pages/Profile/ProfileEditPage";
import SettingsPage from "./pages/Profile/SettingsPage";
import { i } from "framer-motion/client";

export default function App() {
  useKakaoLoaderOnce({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
    libraries: ["clusterer", "drawing", "services"],
  });

  return (
    <Router>
      <AppLayout /> {/* ✅ Router 안쪽으로 이동 */}
    </Router>
  );
}

// 📌 내부 라우팅 설정
function AppLayout() {
  const location = useLocation();
  const hideLayout = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="relative min-h-screen bg-white text-text font-sans overflow-hidden">
      {/* ✅ Header (로그인/회원가입 화면에서는 숨김) */}
      {!hideLayout && (
        <header className="fixed top-0 left-0 w-full z-50">
          <div className="w-full sm:max-w-[500px] mx-auto">
            <Header />
          </div>
        </header>
      )}

      {/* ✅ 메인 컨텐츠 (라우팅 영역) */}
      <main
        className={`relative z-0 ${hideLayout ? "" : "pt-[60px] pb-[80px]"}`}
      >
        <div className="w-full sm:max-w-[500px] mx-auto">
          <Routes>
            {/* ✅ 홈 */}
            <Route path="/" element={<HomePage />} />

            {/* ✅ 산책 관련 */}
            <Route path="/walk" element={<WalkPage />} />
            <Route path="/walk/:walkId" element={<WalkRecordPage />} />

            {/* ✅ 마켓 관련 */}
            <Route path="/market" element={<Market />} />
            <Route path="/market/products" element={<ProductList />} />
            <Route
              path="/market/product/:productId"
              element={<ProductDetail />}
            />
            <Route path="/market/cart" element={<CartList />} />

            {/* ✅ 반려동물 관련 */}
            <Route path="/companion" element={<CompanionListPage />} />
            <Route path="/companion/write" element={<CompanionWritePage />} />
            <Route path="/companion/:id" element={<CompanionDetailPage />} />

            {/* ✅ 채팅 관련 */}
            <Route path="/chat" element={<ChatListPage />} />
            <Route path="/chat/:roomId" element={<ChatRoomPage />} />

            {/* ✅ 로그인/회원가입 */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ✅ 프로필 관련 */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/profile/settings" element={<SettingsPage />} />
            <Route path="/users/me" element={<ProfilePage />} />
          </Routes>
        </div>
      </main>

      {/* ✅ NavBar (로그인/회원가입 화면에서는 숨김) */}
      {!hideLayout && (
        <nav className="fixed bottom-0 left-0 w-full z-50">
          <div className="w-full sm:max-w-[500px] mx-auto shadow-soft">
            <AppNavBar />
          </div>
        </nav>
      )}
    </div>
  );
}

// 📌 하단 네비게이션
function AppNavBar() {
  const navigate = useNavigate();

  const menus = [
    { name: "홈", icon: House, path: "/" },
    { name: "산책", icon: PawPrint, path: "/walk" },
    { name: "마켓", icon: Store, path: "/market" },
    { name: "채팅", icon: MessageCircle, path: "/chat" },
    { name: "프로필", icon: UserRound, path: "/login" },
  ];

  return <NavBar menus={menus} />;
}
