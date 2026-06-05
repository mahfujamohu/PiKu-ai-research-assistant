"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function PaperPage() {
  const { id } = useParams();
  const [paper, setPaper] = useState<any>(null);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchPaper() {
      try {
        const response = await api.get(`/api/papers/${id}`);
        setPaper(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchPaper();
  }, [id]);

  async function saveNote() {
    try {
      await api.post("/api/notes/", { paper_id: id, content: note });
      setMessage("Research note saved!");
      setNote("");
    } catch {
      setMessage("Failed to save note.");
    }
  }

  if (!paper) return <p>Loading paper...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{paper.title}</h1>
      <h3 className="mt-4 text-lg font-semibold">Summary</h3>
      <p>{paper.summary || "No summary available yet."}</p>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Research Note</h3>
        <textarea
          className="w-full border p-2 rounded mt-2 text-black"
          placeholder="Write notes..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={saveNote}
        >
          Save Note
        </button>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </div>
    </div>
  );
}