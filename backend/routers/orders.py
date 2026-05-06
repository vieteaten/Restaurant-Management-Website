from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.orders import Orders
from models.order_items import Order_Items
from models.tables import Table
from models.menu import Menu

router = APIRouter()

@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Orders).all()
    
    result = []
    
    for order in orders:
        table = db.query(Table).filter(Table.id == order.table_id).first()
        order_items = db.query(Order_Items).filter(Order_Items.order_id == order.id).all()

        item_list = []
        for item in order_items:
            menu = db.query(Menu).filter(Menu.id == item.menu_id).first()
            
            if menu:
                item_list.append({
                    "name": menu.name,
                    "price": menu.price,
                    "quantity": item.quantity
                })

        result.append({
            "order_id": order.id,
            "table_name": table.name if table else None,
            "status": order.status,
            "items": item_list,
            "total_price": order.total_price
        })

    return result

@router.post("/")
def create_order(order: dict, db: Session = Depends(get_db)):
    # Tạo object từ dữ liệu gửi lên
    new_order = Orders(
        table_id = order.get("table_id"),
        status = order.get("status", "Đang phục vụ")  # mặc định là "Đang phục vụ"
    )
    
    db.add(new_order)  # thêm order vào session
    db.commit()  # lưu thay đổi vào DB
    db.refresh(new_order)  # lấy thông tin mới nhất (id mới tạo)
    
    
    return {"msg": "Order created"}

#Cập nhật trạng thái order (PUT)
@router.put("/{order_id}")
def update_order_status(order_id: int, data: dict, db: Session = Depends(get_db)):
    status = data.get("status") # Lay trang thai moi tu du lieu gui len (khong duoc nham param truyen thang vao ham)
    #truy van order theo id
    order = db.query(Orders).filter(Orders.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status  # cập nhật trạng thái
    db.commit()  # lưu thay đổi vào DB
    db.refresh(order)  # lấy thông tin mới nhất

    return {"msg": "Don hang da duoc cap nhat", "order_id": order.id, "new_status": order.status}

#Xóa order (DELETE)
@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    #Tim order theo id
    order = db.query(Orders).filter(Orders.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    #Xoa order_items lien quan den order do
    table = db.query(Table).filter(Table.id == order.table_id).first()
    if table:
        table.status = "Trống"  # Cập nhật trạng thái bàn thành "Trong"
    db.query(Order_Items).filter(Order_Items.order_id == order_id).delete()
    db.delete(order)
    db.commit()

    return {"msg": "Don hang da duoc xoa"}

@router.post("/full")
def create_order_full(data: dict, db: Session = Depends(get_db)):

    # 0. Kiem tra xem ban co ton tai khong
    table = db.query(Table).filter(Table.id == data.get("table_id")).first()
    if not table:
        raise HTTPException(status_code=400, detail="Ban khong ton tai")
    if table.status == "Đang dùng":
        raise HTTPException(status_code=400, detail="Ban dang duoc su dung")
    #Cap nhat trang thai ban thanh "Dang dung"
    table.status = "Đang dùng"
    # 1. Tạo order trước
    new_order = Orders(
        table_id=data.get("table_id"),
        status="Đang phục vụ"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    total_price = 0

    # 2. Tạo order_items
    for item in data.get("items", []):
        menu = db.query(Menu).filter(Menu.id == item["menu_id"]).first()
        if not menu:
            raise HTTPException(status_code=400, detail="Menu not found")

        new_item = Order_Items(
            order_id=new_order.id,
            menu_id=item["menu_id"],
            quantity=item["quantity"]
        )
        db.add(new_item)

        # tính tiền
        total_price += menu.price * item["quantity"]

    db.commit()

    # 3. Cập nhật total_price vào order
    new_order.total_price = total_price
    db.commit()

    return {
        "msg": "Order created",
        "order_id": new_order.id,
        "total_price": total_price
    } 

@router.put("/{order_id}/pay")
def pay_order(order_id: int, db: Session = Depends(get_db)):

    order = db.query(Orders).filter(Orders.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status == "Đã thanh toán":
        raise HTTPException(status_code=400, detail="Order already paid")

    # đổi trạng thái order
    order.status = "Đã thanh toán"

    # cập nhật bàn về trống
    table = db.query(Table).filter(Table.id == order.table_id).first()
    if table:
        table.status = "Trống"

    db.commit()

    return {
        "msg": "Thanh toán thành công",
        "order_id": order.id
    }