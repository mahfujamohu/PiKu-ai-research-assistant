from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import auth, papers, notes, chat

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PiKu AI Research Assistant", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(papers.router)
app.include_router(notes.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {"message": "PiKu API is running", "status": "healthy"}