import { Routes, Route } from "react-router-dom";

// Auth
import LoginPage from "../pages/Auth/LoginPage";

// Home
import MainPage from "../pages/Home/MainPage";
import MyPage from "../pages/Home/MyPage";
import NotificationPage from "../pages/Home/NotificationPage";
import ChatbotPage from "../pages/Home/ChatbotPage";

// Product
import ProductListPage from "../pages/Product/ProductListPage";
import ProductDetailPage from "../pages/Product/ProductDetailPage";
import ProductCreatePage from "../pages/Product/ProductCreatePage";

// Repair
import RepairListPage from "../pages/Repair/RepairListPage";
import RepairHistoryPage from "../pages/Repair/RepairHistoryPage";
import RepairCreatePage from "../pages/Repair/RepairCreatePage";
import RepairDetailPage from "../pages/Repair/RepairDetailPage";

export default function Router() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />

      {/* Main */}
      <Route path="/" element={<MainPage />} />

      {/* Product */}
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/new" element={<ProductCreatePage />} />
      <Route path="/products/:productId" element={<ProductDetailPage />} />

      {/* Repair */}
      <Route path="/repairs" element={<RepairListPage />} />
      <Route
        path="/products/:productId/repairs"
        element={<RepairHistoryPage />}
      />
      <Route
        path="/products/:productId/repairs/:repairId"
        element={<RepairDetailPage />}
      />
      <Route
        path="/products/:productId/repairs/new"
        element={<RepairCreatePage />}
      />

      {/* Home */}
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/edit" element={<MyPage />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
    </Routes>
  );
}
