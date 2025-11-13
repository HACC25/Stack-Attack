from src.utils.postgres.connection_handler import db_manager
from src.utils.postgres.models import Users
from sqlalchemy import select


async def store_user_info(user_info: dict):
    async for db in db_manager.get_db():
        stmt = select(Users).filter(Users.sub == user_info["sub"])
        result = await db.execute(stmt)
        existing_user = result.scalars().first()

        if existing_user:
            existing_user.name = user_info.get("name", existing_user.name)
            existing_user.email = user_info.get("email", existing_user.email)
            existing_user.picture = user_info.get("picture", existing_user.picture)
        else:
            new_user = Users(
                sub=user_info["sub"],
                name=user_info.get("name", ""),
                email=user_info.get("email", ""),
                picture=user_info.get("picture"),
            )
            db.add(new_user)

        await db.commit()
