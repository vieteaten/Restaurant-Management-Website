import { useState, useEffect } from "react";
import { getOrders, payOrder, createOrderItem, updateOrderItem, deleteOrderItem, getMenu} from "../api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [newItem, setNewItem] = useState({});

  const loadOrders = () => {
    getOrders().then(setOrders);
  };

  useEffect(() => {
    loadOrders();
    getMenu().then(setMenu);
  }, []);

  const handlePay = async (id) => {
    await payOrder(id);
    loadOrders();
  };

  // thêm món vào order
  const handleAddItem = async (orderId) => {
    const item = newItem[orderId];

    if (!item || !item.menu_id || !item.quantity) {
      alert("Vui lòng chọn món và số lượng");
      return;
    }

    await createOrderItem({
      order_id: orderId,
      menu_id: parseInt(item.menu_id),
      quantity: parseInt(item.quantity)
    });

    loadOrders();
  };

  // tăng số lượng
  const handleIncrease = async (itemId, qty) => {
    await updateOrderItem(itemId, qty + 1);
    loadOrders();
  };

  // giảm số lượng
  const handleDecrease = async (itemId, qty) => {
    if (qty <= 1) return;
    await updateOrderItem(itemId, qty - 1);
    loadOrders();
  };

  // xóa món
  const handleDeleteItem = async (itemId) => {
    await deleteOrderItem(itemId);
    loadOrders();
  };

  return (
    <div>
      <h2>Danh sách đơn hàng</h2>

      {orders.map((o) => (
        <div key={o.order_id} className="order-card">

          <h3>Bàn: {o.table_name}</h3>
          <p>Trạng thái: {o.status}</p>

          <div>
            {o.items?.map((item, i) => (
              <div key={i}>
                {item.name} - {item.quantity} x {item.price}đ

                <button onClick={() => handleIncrease(item.id, item.quantity)}>+</button>
                <button onClick={() => handleDecrease(item.id, item.quantity)}>-</button>
                <button onClick={() => handleDeleteItem(item.id)}>Xóa</button>
              </div>
            ))}
          </div>

          <p>Tổng: {o.total_price}đ</p>

          {/* thêm món */}
          <div>
            <select
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  [o.order_id]: {
                    ...newItem[o.order_id],
                    menu_id: e.target.value
                  }
                })
              }
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
              placeholder="Số lượng"
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  [o.order_id]: {
                    ...newItem[o.order_id],
                    quantity: e.target.value
                  }
                })
              }
            />

            <button onClick={() => handleAddItem(o.order_id)}>
              Thêm món
            </button>
          </div>

          {/* thanh toán */}
          {o.status !== "Đã thanh toán" && (
            <button onClick={() => handlePay(o.order_id)}>
              Thanh toán
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Orders;