#Import cac kieu du lieu
from sqlalchemy import Column, Integer, String, Float, Boolean


#Import base tu database
from database import Base

#Tao class dai dien cho bang Menu
class Menu(Base):
    #Ten bang trong mySQL
    __tablename__ = "menu"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    price = Column(Float)
    category = Column(String(100))
    available = Column(Boolean)

