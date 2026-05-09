import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

db_user = os.getenv("DB_USER")
db_pass = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")

# Tìm đường dẫn file ca.pem chính xác dù chạy ở bất cứ đâu
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ca_path = os.path.join(BASE_DIR, "ca.pem")

DB_URL = f"mysql+pymysql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"

# Tạo engine với cấu hình SSL chuẩn
engine = create_engine(
    DB_URL,
    connect_args={
        "ssl": {
            "ca": ca_path
        }
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()