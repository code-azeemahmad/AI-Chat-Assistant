# app/routers/chat.py
from fastapi import APIRouter, Depends
from app.dependencies import get_chat_service

router = APIRouter(prefix="/api/v1/chat", tags="Chat")

@router.post("/")
def chat(chat_service: Depends(get_chat_service)):
    pass