import httpx
import logging

from urllib.parse import urlencode
from fastapi import Depends, FastAPI, Request
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session

from src.routes.open_ai.route import router as open_ai_router
from src.routes.postgres.route import router as postgres_router
from src.routes.chats.route import router as chats_router
from src.routes.messages.route import router as messages_router
from src.routes.security import create_access_token
from src.utils.postgres.connection_handler import db_manager
from src.utils.postgres.connection_handler import Base
from src.utils.env_helper import get_setting
from src.utils.postgres.queries import store_user_info

## Below is needed for the declaration of the sqlachemy models to be recognized when creating all models.
## TODO: Reorganize to handle this better!
from src.utils.postgres import models

CLIENT_ID = get_setting("OAUTH_CLIENT_ID")
CLIENT_SECRET = get_setting("OAUTH_CLIENT_SECRET")
REDIRECT_URI = get_setting("REDIRECT_URI")
FRONTEND_URL = get_setting("FRONTEND_URL")

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

logger = logging.getLogger(__name__)

# handles startup and shutdown. https://fastapi.tiangolo.com/advanced/events/#lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting up the app...")
    ## This should create all tables, but will not handle table migrations.
    ## Refer to alembic if table migrations are needed.
    Base.metadata.create_all(bind=db_manager.db_engine)
    yield
    print("👋 Shutting down the app...")


app = FastAPI(lifespan=lifespan)

app.include_router(open_ai_router, prefix="/open-ai", tags=["OpenAI"])
app.include_router(postgres_router, prefix="/postgres", tags=["Postgres"])
app.include_router(chats_router, prefix="/chats", tags=["Chats"])
app.include_router(messages_router, prefix="/messages", tags=["Messages"])

@app.middleware("http")
async def basic_middleware(request: Request, call_next):
    print(f"📥 Request received: {request.method} {request.url}")
    response = await call_next(request)
    print(f"📤 Response status: {response.status_code}")
    return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return JSONResponse(status_code=200, content={"message": "Hello World!"})


@app.get("/test_postgres_connection")
def get_users(db: Session = Depends(db_manager.get_db)):
    return JSONResponse(
        status_code=200, content={"message": "Postres connection successful!"}
    )

# Do not call with fetch. call with 'window.location.href = "http://localhost:8000/login";'
@app.get("/login")
def login():
    params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "scope": "openid email profile",
        "redirect_uri": REDIRECT_URI,
        "access_type": "offline",
        "prompt": "consent"
    }
    print(params)
    return RedirectResponse(f"{GOOGLE_AUTH_URL}?{urlencode(params)}")


@app.get("/auth/callback")
async def auth_callback(request: Request):
    code = request.query_params.get("code")
    if not code:
        return JSONResponse({"error": "Missing code"}, status_code=400)

    data = {
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    async with httpx.AsyncClient() as client:
        token_response = await client.post(GOOGLE_TOKEN_URL, data=data)
        token_data = token_response.json()

        headers = {"Authorization": f"Bearer {token_data['access_token']}"}
        user_response = await client.get(GOOGLE_USERINFO_URL, headers=headers)
        user_info = user_response.json()
    store_user_info(user_info=user_info)
    # TODO: Create our own access token JWT and use for future API calls
    # Create our own JWT
    access_token = create_access_token({"sub": user_info["sub"], "email": user_info["email"]})

    # Redirect to frontend with our token
    params = {"token": access_token, "email": user_info["email"], "name": user_info["name"]}
    redirect_url = f"{FRONTEND_URL}/auth/callback?{urlencode(params)}"
    return RedirectResponse(url=redirect_url)

