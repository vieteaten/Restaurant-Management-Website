from pydantic import BaseModel

#Chuan du lieu khi tuong tac voi thong tin mon an
#Du lieu khi tao mon

class MenuCreate(BaseModel):
    name: str
    price: float
    category: str
    available: bool = True  # Mặc định là có sẵn