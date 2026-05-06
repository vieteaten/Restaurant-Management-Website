from http.client import HTTPException
from pydantic import BaseModel
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.menu import Menu  

router = APIRouter()

class MenuItem(BaseModel):
    name: str
    price: int
    category: str
    available: bool = True
# GET menu (lấy danh sách món)
@router.get("/")
def get_menu(db: Session = Depends(get_db)):
    items = db.query(Menu).all()
    return items


# POST thêm món
@router.post("/")
def create_menu(item: MenuItem, db: Session = Depends(get_db)):

    new_item = Menu(
        name=item.name,
        price=item.price,
        category=item.category,
        available=item.available
    )
    
    db.add(new_item)      # thêm vào DB
    db.commit()           # lưu
    db.refresh(new_item)  # lấy lại data (id)

    print(">>> SAVED:", new_item.name) #Kiem tra xem da luu duoc chua (in terminal)
    
    return new_item

#Cap nhat mon an (PUT)
@router.put("/{menu_id}")
def update_menu(menu_id: int, item: dict, db: Session = Depends(get_db)):

    #Tim mon an theo id
    menu_item = db.query(Menu).filter(Menu.id == menu_id).first()

    #Neu khong tim thay thi tra ve loi
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    #Cap nhat thong tin mon an
    menu_item.name = item.get("name", menu_item.name)
    menu_item.price = item.get("price", menu_item.price)
    menu_item.category = item.get("category", menu_item.category)
    menu_item.available = item.get("available", menu_item.available)

    db.commit()
    db.refresh(menu_item)

    return {"msg": "Menu da cap nhat thanh cong", "data": menu_item}

#Xoa mon an (DELETE)
@router.delete("/{menu_id}")
def delete_menu(menu_id: int, db: Session = Depends(get_db)):

    menu_item = db.query(Menu).filter(Menu.id == menu_id).first()

    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    db.delete(menu_item)
    db.commit()

    return {"msg": "Menu da duoc xoa"}
