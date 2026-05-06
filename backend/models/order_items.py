#import kieu du lieu
from sqlalchemy import Column, Integer

#import Base
from database import Base

class Order_Items(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer)
    menu_id = Column(Integer)
    quantity = Column(Integer)