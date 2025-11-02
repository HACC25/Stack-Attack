from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from src.utils.env_helper import get_setting
from sqlalchemy.orm import Session
from src.utils.postgres.connection_handler import db_manager
from src.utils.postgres.models import Users

security = HTTPBearer()
SECRET_KEY = get_setting("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# TODO: modify and use when switching to secure API routes using OAUTH. Currently, all routes are open
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(tz=timezone.utc) + expires_delta
    else:
        expire = datetime.now(tz=timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_sub = payload.get("sub")
        email = payload.get("email")
        if not user_sub:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"sub": user_sub, "email": email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
def get_registered_user(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(db_manager.get_db),
):
    """
    Dependency that checks if the current user exists in the Users table.
    Returns the DB user object if found, otherwise raises 403.
    """
    user = db.query(Users).filter(Users.email == current_user["email"]).first()
    if not user:
        raise HTTPException(status_code=403, detail="User not registered")
    return user