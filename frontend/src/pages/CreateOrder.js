import { useEffect, useState } from "react";
import { getTables, getMenu, createOrder } from "../api";

function CreateOrder() {
  const [tables, setTables] = useState([]);
  const [menu, setMenu] = useState([]);

  const [selectedTable, setSelectedTable] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [cart, setCart] = useState([]);

  useEffect(() => {
    getTables().then(setTables);
    getMenu().then(setMenu);
  }, []);

  // thêm món vào cart
  const handleAddItem = () => {
    if (!selectedMenu) return;

    const menuId = parseInt(selectedMenu);
    const qty = parseInt(quantity);

    const existed = cart.find((item) => item.menu_id === menuId);

    if (existed) {
      setCart(
        cart.map((item) =>
          item.menu_id === menuId
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          menu_id: menuId,
          quantity: qty
        }
      ]);
    }

    setSelectedMenu("");
    setQuantity(1);
  };

  // tạo order
  const handleCreateOrder = async () => {
    if (!selectedTable || cart.length === 0) {
      alert("Vui lòng chọn bàn và món");
      return;
    }

    const result = await createOrder({
      table_id: parseInt(selectedTable),
      items: cart
    });

    alert(result.msg || "Tạo đơn thành công");

    setSelectedTable("");
    setSelectedMenu("");
    setQuantity(1);
    setCart([]);
  };

  // lấy tên món
  const getMenuName = (id) => {
    const item = menu.find((m) => m.id === id);
    return item ? item.name : "";
  };

  return (
    <div className="create-order-container">
      <h2>Tạo đơn mới</h2>

      {/* chọn bàn */}
      <select
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
      >
        <option value="">Chọn bàn</option>
        {tables
          .filter((t) => t.status === "Trống")
          .map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
      </select>

      {/* thêm món */}
      <div className="order-add-row">
        <select
          value={selectedMenu}
          onChange={(e) => setSelectedMenu(e.target.value)}
        >
          <option value="">Chọn món</option>
          {menu.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button onClick={handleAddItem}>
          Thêm món
        </button>
      </div>

      {/* cart */}
      <div className="order-cart">
        <h3>Danh sách món đã chọn</h3>

        {cart.length === 0 && <p>Chưa có món nào</p>}

        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            {getMenuName(item.menu_id)} x {item.quantity}
          </div>
        ))}
      </div>

      <button
        className="create-order-btn"
        onClick={handleCreateOrder}
      >
        Tạo đơn
      </button>
    </div>
  );
}

export default CreateOrder;