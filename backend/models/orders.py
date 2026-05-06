from sqlalchemy import Column, Integer, String, DateTime

from database import Base

from datetime import datetime
class Orders(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    table_id = Column(Integer)
    status  = Column(String(50), default= "Chua thanh toan") #Trang thai (Chua thanh toan, Da thanh toan)
    total_price = Column(Integer, default=0) 
    created_at = Column(DateTime, default=datetime.utcnow)