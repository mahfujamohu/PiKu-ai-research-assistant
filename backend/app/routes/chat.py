from app.services.rag_service import ask_paper_question

# POST /api/chat/ route
answer = ask_paper_question(payload.paper_id, payload.question)