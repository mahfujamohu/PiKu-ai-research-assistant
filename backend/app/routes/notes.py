from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.note import Note
from app.models.paper import Paper
from app.models.user import User
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/notes", tags=["Notes"])


class NoteCreate(BaseModel):
    paper_id: int
    content: str


@router.post("/")
def create_note(
    payload: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    paper = db.query(Paper).filter(
        Paper.id == payload.paper_id,
        Paper.owner_id == current_user.id
    ).first()

    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    note = Note(
        paper_id=payload.paper_id,
        content=payload.content,
        owner_id=current_user.id
    )

    db.add(note)
    db.commit()
    db.refresh(note)

    return {
        "id": note.id,
        "content": note.content,
        "paper_id": note.paper_id,
        "owner_id": note.owner_id,
        "created_at": note.created_at
    }


@router.get("/{paper_id}")
def get_notes(
    paper_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notes = db.query(Note).filter(
        Note.paper_id == paper_id,
        Note.owner_id == current_user.id
    ).all()

    return notes