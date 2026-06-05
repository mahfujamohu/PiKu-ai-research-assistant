import Link from "next/link";
import { Brain, FileText, Search, NotebookPen } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0B1020] text-white">
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D5DFB] to-[#00C2FF] font-bold">
            P
          </div>
          <div>
            <h1 className="text-xl font-bold">PiKu</h1>
            <p className="text-xs text-slate-400">AI Research Assistant</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="text-slate-300 hover:text-white">Login</Link>
          <Link href="/signup" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900">Get Started</Link>
        </div>
      </nav>

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <div className="mb-6 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
          ChatGPT for research papers
        </div>
        <h2 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Understand research papers faster with <span className="gradient-text">PiKu</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Upload PDFs, generate summaries, ask questions, save research notes, and build your personal AI-powered research workspace.
        </p>
        <div className="mt-10 flex gap-4">
          <Link href="/signup" className="rounded-2xl bg-gradient-to-r from-[#6D5DFB] to-[#00C2FF] px-6 py-3 font-semibold">Start Researching</Link>
          <Link href="/login" className="rounded-2xl border border-slate-700 px-6 py-3 font-semibold text-slate-300">Login</Link>
        </div>
        <div className="mt-20 grid w-full gap-6 md:grid-cols-4">
          <Feature icon={<FileText />} title="PDF Upload" />
          <Feature icon={<Brain />} title="AI Summary" />
          <Feature icon={<Search />} title="RAG Q&A" />
          <Feature icon={<NotebookPen />} title="Research Notes" />
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-4 text-cyan-400">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
    </div>
  );
}