import { useState, useEffect } from "react";
import { getMenu, createMenu, updateMenu, deleteMenu } from "../api";

function Menu() {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Món chính");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const loadMenu = () => {
    getMenu().then((data) => {
      setMenu(data);
      setFilteredMenu(data);
    });
  };

  useEffect(() => {
    loadMenu();
  }, []);

  // ===== DEBOUNCE SEARCH =====
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // chờ 0.5s sau khi ngừng gõ

    return () => clearTimeout(timer);
  }, [search]);

  // ===== FILTER =====
  useEffect(() => {
    let data = menu;

    // filter theo category
    if (category) {
      data = data.filter(m => m.category === category);
    }

    // filter theo search
    if (debouncedSearch) {
      data = data.filter(m =>
        m.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    setFilteredMenu(data);
  }, [debouncedSearch, category, menu]);

  // ===== CREATE =====
  const handleCreate = async () => {
    if (!name) return;

    await createMenu({
      name,
      price: 0, // vẫn cần BE nhưng không hiển thị
      category,
      available: true
    });

    setName("");
    loadMenu();
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa món?")) return;

    await deleteMenu(id);
    setMenu(menu.filter(m => m.id !== id));
  };

  // ===== UPDATE =====
  const handleUpdate = async (m) => {
    const newName = prompt("Tên:", m.name);
    const newCategory = prompt(
      "Loại (Món chính / Món phụ / Đồ uống)",
      m.category
    );

    if (!newName || !newCategory) return;

    await updateMenu(m.id, {
      name: newName,
      price: m.price,
      category: newCategory
    });

    loadMenu();
  };

  return (
    <div className="menu-container">
      <h2>Thực đơn</h2>

      {/* ===== FORM ===== */}
      <div className="menu-form">
        <input
          placeholder="Tên món"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Món chính">Món chính</option>
          <option value="Món phụ">Món phụ</option>
          <option value="Đồ uống">Đồ uống</option>
        </select>

        <button onClick={handleCreate}>Thêm</button>
      </div>

      {/* ===== SEARCH ===== */}
      <div className="menu-search">
        <input
          placeholder="Tìm món..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ===== LIST ===== */}
      <div className="menu-list">
        {filteredMenu.length === 0 && <p>Không có món</p>}

        {filteredMenu.map(m => (
          <div key={m.id} className="menu-card">
            <h3>{m.name}</h3>

            <div className="menu-actions">
              <button onClick={() => handleUpdate(m)}>Sửa</button>
              <button onClick={() => handleDelete(m.id)}>Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;