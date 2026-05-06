from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
print("START MAIN FILE")  # thêm dòng này

from routers.menu import router as menu_router

from routers.tables import router as tables_router

from routers.order_items import router as order_items_router

from routers.orders import router as orders_router
#print("AFTER IMPORT MENU") 

app = FastAPI()

print("MAIN LOADED")

@app.get("/")
def root():
    return {"msg": "API is running"}

app.include_router(menu_router, prefix="/menu", tags=["Menu"])
app.include_router(tables_router, prefix="/tables", tags=["Tables"])
app.include_router(orders_router, prefix="/orders", tags=["Orders"])
app.include_router(order_items_router, prefix="/order-items", tags=["Order Items"])

print("ROUTER INCLUDED")  # Print trong terminal để kiểm tra xem đã load xong router chưa


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép tất cả các nguồn (có thể chỉnh sửa để chỉ cho phép một số nguồn cụ thể)
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép tất cả các phương thức HTTP
    allow_headers=["*"],  # Cho phép tất cả các header
)