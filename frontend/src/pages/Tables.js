import { useState, useEffect } from "react";
import { getTables, createTable, updateTable, deleteTable, getOrders} from "../api";

function Tables() {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const loadData = () => {
    getTables().then(setTables);
    getOrders().then(setOrders);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ===== CREATE =====
  const handleCreateTable = async () => {
    const name = prompt("Tên bàn:");
    if (!name) return;

    await createTable({ name, status: "Trống" });
    loadData();
  };

  // ===== DELETE =====
  const handleDeleteTable = async (id) => {
    if (!window.confirm("Xóa bàn này?")) return;

    await deleteTable(id);
    setTables(tables.filter(t => t.id !== id));
  };

  // ===== UPDATE =====
  const handleUpdateTable = async (t) => {
    const name = prompt("Tên bàn:", t.name);
    const status = prompt(
      "Trạng thái (Trống / Đang dùng / Đã đặt):",
      t.status
    );

    if (!name || !status) return;

    await updateTable(t.id, { name, status });
    loadData();
  };

  // ===== SELECT TABLE =====
  const handleSelectTable = (table) => {
    setSelectedTable(table);
  };

  // ===== FIND ORDER =====
  const getOrderByTable = (tableName) => {
    return orders.find(o => o.table_name === tableName);
  };

  return (
    <div className="tables-container">
      <h2>Danh sách bàn</h2>

      <button className="btn-add-table" onClick={handleCreateTable}>Thêm bàn</button>

      <div className="tables-grid">
        {tables.map((t) => (
          <div
            key={t.id}
            className={`table-card ${getStatusClass(t.status)}`}
            onClick={() => handleSelectTable(t)}
          >
            <img src="/table.png" alt="table" />

            <div className="table-info">
              <h3>{t.name}</h3>
              <p>{t.status}</p>
            </div>

            <div className="table-actions">
              <button onClick={(e) => {e.stopPropagation();handleUpdateTable(t);}}>Sửa</button>
              <button onClick={(e) => {e.stopPropagation();handleDeleteTable(t.id);}}>Xóa</button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== DETAIL ===== */}
      {selectedTable && (
        <div className="table-detail">
          <h3>Chi tiết {selectedTable.name}</h3>

          {/* TRỐNG */}
          {selectedTable.status === "Trống" && (
            <p>Bàn hiện đang trống</p>
          )}

          {/* ĐÃ ĐẶT (DEMO) */}
          {selectedTable.status === "Đã đặt" && (
            <div>
              <p>Đặt lúc: 18:30</p>
              <p>Khách: Nguyễn Văn A</p>
            </div>
          )}

          {/* ĐANG DÙNG (REAL DATA) */}
          {selectedTable.status === "Đang dùng" && (() => {
            const order = getOrderByTable(selectedTable.name);

            if (!order) return <p>Chưa có món</p>;

            return (
              <div>
                <p>Đang phục vụ</p>

                <ul>
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>

                <p className="total">
                  Tổng: {order.total_price}đ
                </p>
              </div>
            );
          })()}

          <button onClick={() => setSelectedTable(null)}>Đóng</button>
        </div>
      )}
    </div>
  );
}

// ===== STATUS CLASS =====
function getStatusClass(status) {
  switch (status) {
    case "Trống":
      return "empty";
    case "Đang dùng":
      return "using";
    case "Đã đặt":
      return "reserved";
    default:
      return "";
  }
}

export default Tables;