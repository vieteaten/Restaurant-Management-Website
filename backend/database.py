import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. Đọc file .env để lấy thông số bảo mật
load_dotenv()

# 2. Lấy các thông số từ biến môi trường (Lấy từ ảnh Aiven bạn đã chụp)
db_user = os.getenv("DB_USER")
db_pass = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")

# 3. Tạo chuỗi kết nối chuẩn cho Aiven (Yêu cầu SSL)
# Lưu ý: File ca.pem phải nằm cùng thư mục với file này
DB_URL = f"mysql+pymysql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}?ssl_ca=ca.pem"

# 4. Tạo engine kết nối
engine = create_engine(DB_URL)

# 5. Cấu hình Session
SessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine
)

# 6. Base class cho model
Base = declarative_base()

# 7. Hàm lấy session cho mỗi request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()