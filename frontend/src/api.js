const API_URL = "http://localhost:8000";

// Tables
export const getTables = () =>
  fetch(`${API_URL}/tables/`).then(res => res.json());
export const createTable = (data) =>
  fetch(`${API_URL}/tables`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());
  
export const updateTable = (id, data) =>
  fetch(`${API_URL}/tables/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const deleteTable = (id) =>
  fetch(`${API_URL}/tables/${id}`, {
    method: "DELETE"
  }).then(res => res.json());

// Menu
export const getMenu = () =>
  fetch(`${API_URL}/menu/`).then(res => res.json());

export const createMenu = (data) =>
  fetch(`${API_URL}/menu`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const updateMenu = (id, data) =>
  fetch(`${API_URL}/menu/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const deleteMenu = (id) =>
  fetch(`${API_URL}/menu/${id}`, {
    method: "DELETE"
  }).then(res => res.json());

// Orders
export const getOrders = () =>
  fetch(`${API_URL}/orders/`).then(res => res.json());

export const createOrderItem = (orderId, data) =>
  fetch(`${API_URL}/order-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      order_id: orderId,
      ...data
    })
  }).then(res => res.json());

export const payOrder = (id) =>
  fetch(`${API_URL}/orders/${id}/pay`, {
    method: "PUT"
  }).then(res => res.json());

export const createOrder = (data) =>
  fetch(`${API_URL}/orders/full`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const updateOrderItem = (id, quantity) =>
  fetch(`${API_URL}/order-items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity })
  }).then(res => res.json());

export const deleteOrderItem = (id) =>
  fetch(`${API_URL}/order-items/${id}`, {
    method: "DELETE"
  }).then(res => res.json());