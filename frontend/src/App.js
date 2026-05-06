import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Orders from "./pages/Orders";
import Menu from "./pages/Menu";
import Tables from "./pages/Tables";
import CreateOrder from "./pages/CreateOrder";
import Home from "./pages/Home";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <nav class="navbar">
        <h2>Hệ thống quản lý nhà hàng</h2>
        <div class="nav-links">
          <Link to="/">Trang chủ</Link>
          <Link to="/tables">Bàn</Link>
          <Link to="/menu">Món ăn</Link>
          <Link to="/orders">Đơn hàng</Link>
          <Link to="/create-order">Tạo đơn</Link>
        </div>
      </nav>
      
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/create-order" element={<CreateOrder />} />
      </Routes>
      </div>
      
    </BrowserRouter>
  );
}

export default App;