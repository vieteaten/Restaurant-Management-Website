# import hàm tạo engine (kết nối DB)
from sqlalchemy import create_engine  

# import để tạo session (làm việc với DB)
from sqlalchemy.orm import sessionmaker  

# import de tao base class cho model
from sqlalchemy.orm import declarative_base

#Chuoi ket noi toi mysql
DB_URL = "mysql+pymysql://root:liqbbn123@localhost:3306/restaurant"

#engine = "Cau noi giua Python va mysql"
engine = create_engine(DB_URL)

# SessionLocal = công cụ để thao tác với DB (query, insert, update...)
SessionLocal  = sessionmaker(
    autocommit= False, #khong tu thuc hien
    autoflush= False, #Khong tu xuong dong
    bind= engine #lien ket voi engine
)

#Base = class goc de tao bang (model)
Base = declarative_base() 
#Ham de tu dong lay session (ket noi va dong DB) cho tung request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()