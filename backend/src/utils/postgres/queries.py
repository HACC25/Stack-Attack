from src.utils.postgres.connection_handler import db_manager
from src.utils.postgres.models import Users
from sqlalchemy.orm import Session


def store_user_info(user_info: dict):
    db_gen = db_manager.get_db()
    db: Session = next(db_gen)
    try:
        existing_user = db.query(Users).filter(Users.sub == user_info["sub"]).first()

        if existing_user:
            existing_user.name = user_info.get("name", existing_user.name)
            existing_user.email = user_info.get("email", existing_user.email)
            existing_user.picture = user_info.get("picture", existing_user.picture)
        else:
            new_user = Users(
                sub=user_info["sub"],
                name=user_info.get("name", ""),
                email=user_info.get("email", ""),
                picture=user_info.get("picture", None),
            )
            db.add(new_user)

        db.commit()
    finally:
        db.close()
