from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.routes.open_ai.route import router as open_ai_router


# handles startup and shutdown. https://fastapi.tiangolo.com/advanced/events/#lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting up the app...")
    yield
    print("👋 Shutting down the app...")


app = FastAPI(lifespan=lifespan)

app.include_router(open_ai_router, prefix="/open-ai", tags=["OpenAI"])


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
