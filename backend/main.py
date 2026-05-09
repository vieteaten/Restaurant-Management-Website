from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

print("--- STARTING BACKEND SERVER ---")

# Import các router
from routers.menu import router as menu_router
from routers.tables import router as tables_router
from routers.order_items import router as order_items_router
from routers.orders import router as orders_router

app = FastAPI(title="He Thong Quan Ly Nha Hang API")

# 1. Cấu hình CORS (Đặt ngay sau khi tạo app)
# Cho phép Frontend kết nối vào Backend mà không bị chặn
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

print("CORS MIDDLEWARE ADDED")

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Welcome to Restaurant Management API",
        "docs": "/docs"
    }

# 2. Include các Router
app.include_router(menu_router, prefix="/menu", tags=["Menu"])
app.include_router(tables_router, prefix="/tables", tags=["Tables"])
app.include_router(orders_router, prefix="/orders", tags=["Orders"])
app.include_router(order_items_router, prefix="/order-items", tags=["Order Items"])

print("ALL ROUTERS INCLUDED SUCCESSFULLY")
print("--- MAIN LOADED AND READY ---")