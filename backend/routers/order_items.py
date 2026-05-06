from fastapi import APIRouter, HTTPException, Depends
from models.orders import Orders
from models.tables import Table
from models.menu import Menu
from sqlalchemy.orm import Session
from database import get_db
from models.order_items import Order_Items

router = APIRouter() 

@router.get("/")
def get_order_items(db: Session = Depends(get_db)):
    items = db.query(Order_Items).all()
    return items

@router.post("/")
def create_order_item(item: dict, db: Session = Depends(get_db)):
    # Tạo object từ dữ liệu gửi lên
    order = db.query(Orders).filter(Orders.id == item.get("order_id")).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    menu = db.query(Menu).filter(Menu.id == item.get("menu_id")).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    new_item = Order_Items(
        order_id = item.get("order_id"),
        menu_id = item.get("menu_id"),
        quantity = item.get("quantity"),
        price = menu.price
    )
    db.add(new_item)  # thêm order item vào session
    db.commit()  # lưu thay đổi vào DB
    db.refresh(new_item)  # lấy thông tin mới nhất (id mới tạo)
    
    
    return {"msg": "Order item added"}

# PUT cập nhật số lượng order item
@router.put("/{item_id}")
def update_order_item(item_id: int, quantity: int, db: Session = Depends(get_db)):

    # Tìm order item theo id
    order_item = db.query(Order_Items).filter(Order_Items.id == item_id).first()
    
    # Nếu không tìm thấy thì trả về lỗi
    if not order_item:
        raise HTTPException(status_code=404, detail="Order item not found")
    
    # Cập nhật số lượng
    order_item.quantity = quantity
    
    db.commit()
    db.refresh(order_item)
    
    
    return {"msg": "Order item updated", "data": order_item}

# DELETE xóa order item
@router.delete("/{item_id}")
def delete_order_item(item_id: int, db: Session = Depends(get_db)):
    # Tìm order item theo id
    order_item = db.query(Order_Items).filter(Order_Items.id == item_id).first()
    
    # Nếu không tìm thấy thì trả về lỗi
    if not order_item:
        raise HTTPException(status_code=404, detail="Order item not found")
    
    db.delete(order_item)
    db.commit()
    
    
    return {"msg": "Order item deleted"}

