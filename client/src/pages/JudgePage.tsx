import { useState, useEffect } from "react";
import { usePageant } from "../context/PageantContext";

import ScoringSection from "../components/ScoringSection";
import FireflyField from "../components/fx/FireflyField";

export default function JudgePageLayout() {
  const logopath = "http://localhost/tab/logo.png";

  // Pull everything from CONTEXT:
  const {
    candidates,
    criteria,
    selectedCandidate,
    setSelectedCandidate,
    scores,
    updateScore,
    loadScoresFromDB,
    saveScoresToDB,
  } = usePageant();

  // ------------------------------
  // CATEGORY FILTER
  // ------------------------------
  const [categoryFilter, setCategoryFilter] = useState<"Male" | "Female">(
    "Male"
  );

  const filteredCandidates = candidates.filter(
    (c) => c.category === categoryFilter
  );

  // Auto-select first candidate when category changes
  useEffect(() => {
    const first = filteredCandidates[0];
    if (first) setSelectedCandidate(first);
  }, [categoryFilter, candidates]);

  // Auto-load scores from DB when selectedCandidate changes
  useEffect(() => {
    if (selectedCandidate) {
      loadScoresFromDB(selectedCandidate.id);
    }
  }, [selectedCandidate]);

  // Auto-save scores to DB when scores change
  useEffect(() => {
    if (!selectedCandidate) return;
    saveScoresToDB(selectedCandidate.id); 
  }, [scores]);

  const [activeTab, setActiveTab] = useState<
    "scoring" | "dashboard" | "reports"
  >("scoring");

  return (
    <div className="h-screen flex bg-[#1b1a1d] text-[#d8bd71] font-sans overflow-hidden">
      {/* LEFT PANEL */}
      <div className="w-[43%] border-r border-[#3a393b] flex flex-col custom-scrollbar">
        {/* HEADER */}
        <div className="sticky top-0 z-20 bg-[#1b1a1d]/95 backdrop-blur-sm border-b border-[#3a393b] px-6 py-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
          <img src={logopath} className="h-12 w-auto" />

          <div className="flex gap-3">
            {(["Male", "Female"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`relative px-5 py-2 rounded-full font-semibold text-sm transition-all border-2 duration-200 ${
                  categoryFilter === cat
                    ? "bg-[#d8bd71] text-[#1b1a1d] border-[#d8bd71] shadow-[0_0_10px_#d8bd71]"
                    : "border-[#bea256] text-[#bea256] hover:bg-[#bea256]/20 hover:shadow-[0_0_6px_#bea256]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* CANDIDATE LIST */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
          <FireflyField count={150} />

          {filteredCandidates.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCandidate(c)}
              className={`relative cursor-pointer rounded-xl border overflow-hidden transition-all duration-300 group hover:shadow-[0_0_10px_#bea25640]   h-[255px] ${
                selectedCandidate?.id === c.id
                  ? "border-[#d8bd71] scale-[1.03] shadow-[0_0_5px_#d8bd71]"
                  : "border-[#3a393b] hover:border-[#bea256]"
              }`}
            >
              <div className="absolute top-2 left-2 z-20 bg-[#1b1a1d]/80 backdrop-blur-sm border border-[#d8bd71]/50 text-[#d8bd71] font-bold rounded-full w-10 h-10 flex items-center justify-center text-sm tracking-wider shadow-[0_0_6px_rgba(216,189,113,0.3)]">
                {String(c.number).padStart(2, "0")}
              </div>

              <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
                <img
                  src={c.img}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#1b1a1d]/80 to-[#1b1a1d]/0 pointer-events-none" />
              </div>

              <div className="p-3 bg-[#222124] flex flex-col justify-center">
                <h3 className="text-gray-300 font-semibold truncate">
                  {c.name}
                </h3>
                <p className="text-gray-400 text-xs">{c.representing}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 px-10 py-2">
        {/* NAV */}
        <nav className="mb-8 border-b border-[#3a393b] pb-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-200">Judge Dashboard</h1>

          <ul className="flex items-center gap-10 text-sm font-semibold">
            {[
              { id: "scoring", label: "Scoring Section" },
              { id: "dashboard", label: "Dashboard" },
              { id: "reports", label: "Reports & Analytics" },
            ].map((tab) => (
              <li
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`cursor-pointer ${
                  activeTab === tab.id
                    ? "text-[#f7e9c2] border-b-2 border-[#d8bd71]"
                    : "text-[#bea256]/70 hover:text-[#f7e9c2]"
                }`}
              >
                {tab.label}
              </li>
            ))}
          </ul>

          <button className="bg-[#d8bd71] text-[#1b1a1d] px-5 py-2 rounded-full font-semibold  hover:bg-[#bea256] shadow-[0_0_10px_#bea25660] transition">
            Logout
          </button>
        </nav>

        {/* SCORING TAB */}
        {activeTab === "scoring" && selectedCandidate && (
          <>
            <section className="flex items-start gap-8 mb-5">
              <div className="w-1/4">
                <img
                  src={selectedCandidate.img}
                  className="w-full rounded-lg border border-[#3a393b]"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-[#d8bd71] mb-1">
                  {selectedCandidate.name}
                </h2>

                <p className="text-gray-400 text-sm">
                  Category: {selectedCandidate.category}
                </p>
                <p className="text-gray-400 text-sm">
                  Representing: {selectedCandidate.representing}
                </p>
              </div>
            </section>

            {/* 🔥 SCORING COMPONENT (hook integrated) */}
            <ScoringSection
              criteria={criteria}
              scores={scores}
              handleScoreChange={updateScore}
              highlightCategoryId="A"
            />
          </>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <section className="mt-6 text-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-[#d8bd71]">
              My Scoring Dashboard
            </h2>

            <table className="w-full border-collapse border border-[#3a393b] text-sm">
              <thead>
                <tr className="bg-[#222124] text-[#bea256]">
                  <th className="border px-3 py-2">#</th>
                  <th className="border px-3 py-2">Candidate</th>
                  <th className="border px-3 py-2 text-center">Category</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c) => (
                  <tr key={c.id} className="hover:bg-[#2a292c]/50">
                    <td className="border px-3 py-2">{c.number}</td>
                    <td className="border px-3 py-2">{c.name}</td>
                    <td className="border px-3 py-2 text-center">
                      {c.category}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* REPORTS */}
        {activeTab === "reports" && (
          <section className="mt-6 text-gray-300">
            <h2 className="text-xl font-semibold mb-4 text-[#d8bd71]">
              Reports & Analytics
            </h2>
            <p className="text-gray-400">Coming soon…</p>
          </section>
        )}

        <footer className="mt-10 border-t border-[#3a393b] pt-4 text-center text-xs text-gray-500">
          © 2025 Pageant Tabulator — Designed with Elegance & Precision
        </footer>
      </div>
    </div>
  );
}