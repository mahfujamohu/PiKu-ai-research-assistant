"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  Sparkles,
  LogOut,
  Search,
  NotebookPen,
} from "lucide-react";

type Paper = {
  id: number;
  title: string;
  filename: string;
  summary: string | null;
  created_at: string;
};

export default function DashboardPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function fetchPapers() {
    try {
      const response = await api.get("/api/papers/");
      setPapers(response.data);
    } catch (err) {
      console.error(err);
      setError("Please login again to load your papers.");
    }
  }

  async function uploadPaper() {
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/api/papers/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFile(null);
      await fetchPapers();
    } catch (err) {
      console.error(err);
      setError("Upload failed. Check backend server and OpenAI/API settings.");
    } finally {
      setUploading(false);
    }
  }

  function logout() {
    localStorage.removeItem("piku_token");
    window.location.href = "/login";
  }

  useEffect(() => {
    fetchPapers();
  }, []);

  return (
    <main className="min-h-screen bg-[#070B18] text-white">
      <nav className="border-b border-white/10 bg-white/[0.03] px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D5DFB] to-[#00C2FF]">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold">PiKu</h1>
              <p className="text-xs text-slate-400">Research Workspace</p>
            </div>
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <p className="text-sm font-semibold text-cyan-400">
            AI Research Assistant
          </p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            Welcome to your PiKu Dashboard
          </h2>
          <p className="mt-4 max-w-2xl text-slate-400">
            Upload papers, generate summaries, ask questions, and save research
            notes in one smart workspace.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-cyan-950/30">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                  <UploadCloud size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Upload Research Paper</h3>
                  <p className="text-sm text-slate-400">
                    Upload a PDF and let PiKu prepare it for research.
                  </p>
                </div>
              </div>

              <input
                type="file"
                accept="application/pdf"
                className="block w-full rounded-2xl border border-white/10 bg-[#0D1326] p-4 text-sm text-slate-300"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <button
                onClick={uploadPaper}
                disabled={!file || uploading}
                className="mt-6 rounded-2xl bg-gradient-to-r from-[#6D5DFB] to-[#00C2FF] px-7 py-4 font-semibold disabled:opacity-50"
              >
                {uploading ? "Processing with PiKu..." : "Upload & Analyze"}
              </button>
            </div>

            <div className="mt-10">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold">My Papers</h3>
                <p className="text-sm text-slate-400">
                  {papers.length} paper{papers.length !== 1 ? "s" : ""}
                </p>
              </div>

              {papers.length === 0 ? (
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
                  <FileText className="mx-auto mb-4 text-cyan-400" size={42} />
                  <h4 className="text-xl font-bold">No papers uploaded yet</h4>
                  <p className="mt-2 text-slate-400">
                    Upload your first research paper to start using PiKu.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {papers.map((paper) => (
                    <Link
                      key={paper.id}
                      href={`/paper/${paper.id}`}
                      className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-cyan-400/40"
                    >
                      <FileText className="mb-4 text-cyan-400" />
                      <h4 className="text-xl font-bold">{paper.title}</h4>
                      <p className="mt-2 text-sm text-slate-500">
                        {paper.filename}
                      </p>
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                        {paper.summary || "No summary available yet."}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <InfoCard
              icon={<Search />}
              title="Ask PiKu"
              text="Ask questions about uploaded research papers using context-aware AI."
            />
            <InfoCard
              icon={<NotebookPen />}
              title="Research Notes"
              text="Save important findings, limitations, and ideas for later."
            />
            <InfoCard
              icon={<Sparkles />}
              title="Smart Workspace"
              text="Your papers, notes, and AI research workflow in one place."
            />
          </aside>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-4 text-cyan-400">{icon}</div>
      <h4 className="text-lg font-bold">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}