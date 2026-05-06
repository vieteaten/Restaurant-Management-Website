#import kieu du lieu
from sqlalchemy import Column, Integer, String

#import base tu database
from database import Base

#create class dai dien cho bang Table
class Table(Base):
    #Ten bang trong mySQL
    __tablename__ = "tables"
    #Khai bao cac cot trong bang
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    status = Column(String(50)) #Trang thai (Trong, dang dung, da dat truoc)



