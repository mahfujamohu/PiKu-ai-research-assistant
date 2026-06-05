import os, shutil
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.paper import Paper
from app.schemas.paper import PaperResponse
from app.utils.security import get_current_user
from app.services.pdf_service import summarize_pdf
from app.config import UPLOAD_DIR

os.makedirs(UPLOAD_DIR, exist_ok=True)
router = APIRouter(prefix="/api/papers", tags=["Papers"])

@router.post("/upload", response_model=PaperResponse)
def upload_paper(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    safe_filename = file.filename.replace(" ", "_")
    file_path = os.path.join(UPLOAD_DIR, f"{current_user.id}_{safe_filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        summary = summarize_pdf(file_path)
    except Exception:
        summary = "PiKu successfully uploaded this PDF. AI summary will appear when OpenAI key is valid."

    paper = Paper(
        title=safe_filename.replace(".pdf","").replace("_"," "),
        filename=file.filename,
        file_path=file_path,
        owner_id=current_user.id,
        summary=summary
    )
    db.add(paper)
    db.commit()
    db.refresh(paper)
    return paper

@router.get("/", response_model=list[PaperResponse])
def get_my_papers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    papers = db.query(Paper).filter(Paper.owner_id==current_user.id).order_by(Paper.created_at.desc()).all()
    return papers

@router.get("/{paper_id}", response_model=PaperResponse)
def get_paper(paper_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    paper = db.query(Paper).filter(Paper.id==paper_id, Paper.owner_id==current_user.id).first()
    if not paper:
        raise HTTPException(404, "Paper not found")
    return paper

@router.delete("/{paper_id}")
def delete_paper(paper_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    paper = db.query(Paper).filter(Paper.id==paper_id, Paper.owner_id==current_user.id).first()
    if not paper:
        raise HTTPException(404, "Paper not found")
    os.remove(paper.file_path)
    db.delete(paper)
    db.commit()
    return {"detail":"Paper deleted successfully"}