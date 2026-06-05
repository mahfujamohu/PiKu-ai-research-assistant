import chromadb
from app.config import CHROMA_PATH
from app.services.openai_service import create_embedding, generate_answer

chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)

def get_collection(paper_id: int):
    return chroma_client.get_or_create_collection(name=f"paper_{paper_id}")

def store_paper_chunks(paper_id: int, chunks: list[str]):
    collection = get_collection(paper_id)
    ids, embeddings, documents, metadatas = [], [], [], []
    for idx, chunk in enumerate(chunks):
        ids.append(f"{paper_id}_{idx}")
        embeddings.append(create_embedding(chunk))
        documents.append(chunk)
        metadatas.append({"chunk_index": idx})
    collection.add(ids=ids, embeddings=embeddings, documents=documents, metadatas=metadatas)

def ask_paper_question(paper_id: int, question: str) -> str:
    collection = get_collection(paper_id)
    question_embedding = create_embedding(question)
    results = collection.query(query_embeddings=[question_embedding], n_results=5)
    context_chunks = results["documents"][0]
    context = "\n\n".join(context_chunks)
    prompt = f"""
You are PiKu, an AI research assistant.
Answer the user's question using ONLY the provided research paper context.
If the answer is not available in the context, say that the paper does not provide enough information.
Research paper context:
{context}
User question:
{question}
Answer in a clear academic style.
"""
    return generate_answer(prompt)

def summarize_paper(text: str) -> str:
    shortened_text = text[:12000]
    prompt = f"""
You are PiKu, an AI research assistant.
Summarize this research paper in four sections:
1. Abstract Summary
2. Simplified Explanation
3. Methodology Summary
4. Key Contributions
Paper text:
{shortened_text}
"""
    return generate_answer(prompt)