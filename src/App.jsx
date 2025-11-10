import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CompanionListPage from "./pages/CompanionListPage";
import CompanionWritePage from "./pages/CompanionWritePage";
import CompanionDetailPage from "./pages/CompanionDetailPage";
import ChatRoomPage from "./pages/ChatRoomPage";
import ChatListPage from "./pages/ChatListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/companion" element={<CompanionListPage />} />
        <Route path="/companion/write" element={<CompanionWritePage />} />
        <Route path="/companion/:id" element={<CompanionDetailPage />} />
        <Route path="/chat" element={<ChatListPage />} />
        <Route path="/chat/:roomId" element={<ChatRoomPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
