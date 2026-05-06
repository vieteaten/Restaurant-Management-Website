#import API
from fastapi import APIRouter, Depends, HTTPException

#import SessionLocal tu database
from database import get_db
#import model Table
from models.tables import Table
from sqlalchemy.orm import Session

router = APIRouter()

#Get tat ca ban
@router.get("/")
def get_tables(db: Session = Depends(get_db)):
    # lay tat ca ban
    tables = db.query(Table).all()
    
    return tables

#Post tao ban moi

@router.post("/")
def create_table(table: dict, db: Session = Depends(get_db)):
    #Tao object tu du lieu gui len
    new_table = Table(
        name = table.get("name"),
        status = table.get("status", "Trống")  # mac dinh la "Trống"
    )
    
    db.add(new_table)  # them ban vao session
    db.commit()  # luu thay doi vao DB
    db.refresh(new_table)  # lay thong tin moi nhat (id moi tao)
    
    return {"msg": "Ban da duoc them", "table_id": new_table.id}

#Cap nhat trang thai ban (PUT)
@router.put("/{table_id}")
def update_table_status(table_id: int, data: dict, db: Session = Depends(get_db)):
    table = db.query(Table).filter(Table.id == table_id).first()

    if not table:
        raise HTTPException(status_code=404, detail="Ban khong ton tai")

    table.name = data.get("name", table.name)
    table.status = data.get("status", table.status)

    db.commit()
    db.refresh(table)

    return {"msg": "Cap nhat thanh cong", "data": table}

#Xoa ban (DELETE)
@router.delete("/{table_id}")
def delete_table(table_id: int, db: Session = Depends(get_db)):
    #Tim ban theo id
    table = db.query(Table).filter(Table.id == table_id).first()
    
    if not table:
        raise HTTPException(status_code=404, detail="Ban khong ton tai")
    
    db.delete(table)
    db.commit()
    
    return {"msg": "Ban da duoc xoa"}