import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { House, PawPrint, MessageCircle, Store, UserRound } from "lucide-react";

// 공통 컴포넌트
import Header from "./components/ui/Header";
import NavBar from "./components/ui/NavBar";
import useKakaoLoaderOnce from "./hooks/useKakaoLoaderOnce";

// 주요 페이지
import HomePage from "./pages/HomePage";
import WalkPage from "./pages/walk/WalkPage";
import WalkRecordPage from "./pages/walk/WalkRecordPage";

// 마켓
import Market from "./pages/market/Market";
import ProductList from "./pages/market/ProductList";
import ProductDetail from "./pages/market/ProductDetail";
import CartList from "./pages/market/CartList";
import Order from "./pages/market/Order";
import OrderList from "./pages/market/OrderList";
import PaymentSuccess from "./pages/market/PaymentSuccess";
import PaymentFail from "./pages/market/PaymentFail";

// 동행
import CompanionListPage from "./pages/companion/CompanionListPage";
import CompanionWritePage from "./pages/companion/CompanionWritePage";
import CompanionDetailPage from "./pages/companion/CompanionDetailPage";
import ChatRoomPage from "./pages/companion/ChatRoomPage";
import ChatListPage from "./pages/companion/ChatListPage";
import ProfileApplyPage from "./pages/Profile/ProfileApplyPage";
import CompanionReviewWritePage from "./pages/companion/CompanionReviewWritePage";

// 로그인 / 회원가입
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

// 프로필
import ProfilePage from "./pages/Profile/ProfilePage";
import ProfileEditPage from "./pages/Profile/ProfileEditPage";
import SettingsPage from "./pages/Profile/SettingsPage";

// 반려견
import DogAddPage from "./pages/Dog/DogAddPage";
import DogListPage from "./pages/Dog/DogListPage";
import DogDetailPage from "./pages/Dog/DogDetailPage";
import DogEditPage from "./pages/Dog/DogEditPage";

import CompanionEditPage from "./pages/companion/CompanionEditPage";
import AllListPage from "./pages/AllListPage";
import SearchPage from "./pages/SearchPage";

export default function App() {
  useKakaoLoaderOnce({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
    libraries: ["clusterer", "drawing", "services"],
  });

  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

// 내부 라우팅
function AppLayout() {
  const location = useLocation();

  // 로그인 / 회원가입 헤더 제외
  const hideLayout = ["/login", "/signup"].includes(location.pathname);

  // 헤더 패딩 제거 페이지 (/walk)
  const noHeaderPaddingPages = ["/walk"];
  const isWalkPage = noHeaderPaddingPages.includes(location.pathname);

  // 나머지 페이지에 padding top 적용
  const mainPadding = !hideLayout && !isWalkPage ? "pt-12" : "";

  return (
    <div className="relative min-h-screen bg-white text-text font-sans overflow-hidden">

      {/* Header */}
      {!hideLayout && (
        <header className="fixed top-0 left-0 w-full z-50">
          <div className="w-full sm:max-w-[500px] mx-auto">
            <Header />
          </div>
        </header>
      )}

      {/* 메인 */}
      <main className={`relative z-0 ${mainPadding}`}>
        <div className="w-full sm:max-w-[500px] mx-auto">
          <Routes>
            {/* 홈 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/all-list" element={<AllListPage />} />

            {/* 산책 */}
            <Route path="/walk" element={<WalkPage />} />
            <Route path="/walk/:walkId" element={<WalkRecordPage />} />

            {/* 마켓 */}
            <Route path="/market" element={<Market />} />
            <Route path="/market/products" element={<ProductList />} />
            <Route path="/market/product/:productId" element={<ProductDetail />} />
            <Route path="/market/cart" element={<CartList />} />
            <Route path="/market/orders" element={<OrderList />} />
            <Route path="/market/order" element={<Order />} />
            <Route path="/market/payment/success" element={<PaymentSuccess />} />
            <Route path="/market/payment/fail" element={<PaymentFail />} />

            {/* 동행 */}
            <Route path="/companion" element={<CompanionListPage />} />
            <Route path="/companion/write" element={<CompanionWritePage />} />
            <Route path="/companion/:id" element={<CompanionDetailPage />} />
            <Route path="/profile/apply" element={<ProfileApplyPage />} />
            <Route path="/companion/review/write/:applyId" element={<CompanionReviewWritePage />} />
            <Route path="/companion/edit/:id" element={<CompanionEditPage />} />

            {/* 채팅 */}
            <Route path="/chat" element={<ChatListPage />} />
            <Route path="/chat/:roomId" element={<ChatRoomPage />} />

            {/* 로그인 */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 프로필 */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/profile/settings" element={<SettingsPage />} />
            <Route path="/users/me" element={<ProfilePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />

            {/* 반려견 */}
            <Route path="/dogs/add" element={<DogAddPage />} />
            <Route path="/dogs/:dogId" element={<DogDetailPage />} />
            <Route path="/dogs/:dogId/edit" element={<DogEditPage />} />
            <Route path="/dogs" element={<DogListPage />} />

            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </div>
      </main>

      {/* NavBar */}
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

// 하단 네비게이션
function AppNavBar() {
  const navigate = useNavigate();

  const menus = [
    { name: "홈", icon: House, path: "/" },
    { name: "산책", icon: PawPrint, path: "/walk" },
    { name: "마켓", icon: Store, path: "/market" },
    { name: "채팅", icon: MessageCircle, path: "/chat" },
    { name: "프로필", icon: UserRound, path: "/profile" },
  ];

  return <NavBar menus={menus} />;
}
