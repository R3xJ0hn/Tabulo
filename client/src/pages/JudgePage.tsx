import { useState } from "react";
import ScoringSection from "../components/ScoringSection";
import FireflyField from "../components/fx/FireflyField";

export default function JudgePageLayout() {
  const logopath = "http://localhost/tab/logo.png";

  const candidates = [
  { id: 1, number: 1, name: "Sofia Mitchell", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/1.jpg" },
  { id: 2, number: 2, name: "Ariana Collins", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/2.jpg" },
  { id: 3, number: 3, name: "Luna Reynolds", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/3.jpg" },
  { id: 4, number: 4, name: "Elise Hartman", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/4.jpg" },
  { id: 5, number: 5, name: "Alexis Monroe", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/5.jpg" },
  { id: 6, number: 6, name: "Janelle Porter", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/6.jpg" },
  { id: 7, number: 7, name: "Juniper Wallace", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/7.jpg" },
  { id: 8, number: 8, name: "Grace Whitman", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/8.jpg" },
  { id: 9, number: 9, name: "Ava Thornton", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/9.jpg" },
  { id: 10, number: 10, name: "Alexa Harrington", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/10.jpg" },

  { id: 11, number: 1, name: "Christian Hughes", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/1.jpg" },
  { id: 12, number: 2, name: "Eric Donovan", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/2.jpg" },
  { id: 13, number: 3, name: "Axel Montgomery", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/3.jpg" },
  { id: 14, number: 4, name: "Ryzen Caldwell", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/4.jpg" },
  { id: 15, number: 5, name: "Alvin Castillo", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/5.jpg" },
  { id: 16, number: 6, name: "Jericho Fleming", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/6.jpg" },
  { id: 17, number: 7, name: "Rafael Bennett", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/7.jpg" },
  { id: 18, number: 8, name: "Steven Holloway", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/8.jpg" },
  { id: 19, number: 9, name: "Welnard Cross", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/9.jpg" },
  { id: 20, number: 10, name: "Rommel Davenport", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/10.jpg" },
];


  const criteria = [
    {
      id: "A",
      name: "FILIPINIANA AND BARONG",
      weight: 30, // sum of subcriteria weights or appropriate value
      subcriteria: [
        { id: "A1", name: "Cultural Relevance (Theme)", weight: 15 },
        { id: "A2", name: "Creativity & Originality", weight: 7 },
        { id: "A3", name: "Poise & Bearing", weight: 8 },
      ],
    },
    {
      id: "B",
      name: "FORMAL WEAR",
      weight: 30,
      subcriteria: [
        { id: "B1", name: "Suitability to the Wearer", weight: 15 },
        { id: "B2", name: "Stage Presence", weight: 7 },
        { id: "B3", name: "Poise & Bearing", weight: 8 },
      ],
    },
    {
      id: "C",
      name: "QUESTION & ANSWER (Q&A)",
      weight: 40,
      subcriteria: [
        { id: "C1", name: "Wit & Content", weight: 20 },
        { id: "C2", name: "Projection & Delivery", weight: 10 },
        { id: "C3", name: "Stage Presence", weight: 10 },
      ],
    },
    // Example of “flat” criteria (no subcategories)
    { id: "D", name: "Production Number & Introduction", weight: 10 },
    { id: "E", name: "School Uniform", weight: 15 },
    { id: "F", name: "Barbie & Ken", weight: 15 },
    { id: "G", name: "Sports Wear", weight: 15 },
    { id: "H", name: "Formal Wear", weight: 15 },
    { id: "I", name: "Beauty", weight: 15 },
    { id: "J", name: "Q & A", weight: 15 },
  ];





  const [categoryFilter, setCategoryFilter] = useState<"Male" | "Female">(
    "Male"
  );
  const filteredCandidates = candidates.filter(
    (c) => c.category === categoryFilter
  );
  const [selected, setSelected] = useState(filteredCandidates[0]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<
    "scoring" | "dashboard" | "reports"
  >("scoring");

  function handleScoreChange(id: string, value: number) {
    setScores((prev) => ({ ...prev, [id]: value }));
  }
  return (
    <div className="h-screen flex bg-[#1b1a1d] text-[#d8bd71] font-sans overflow-hidden">
      {/* LEFT PANEL */}
      <div className="w-[43%] border-r border-[#3a393b] flex flex-col custom-scrollbar">
        {/* FIXED HEADER */}
        <div className="sticky top-0 z-20 bg-[#1b1a1d]/95 backdrop-blur-sm border-b border-[#3a393b] px-6 py-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3">
            <img
              src={logopath}
              alt="logo"
              className="h-12 w-auto object-contain"
            />
          </div>

          <div className="flex gap-3">
            {(["Male", "Female"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategoryFilter(cat);
                  const firstInCat = candidates.find((c) => c.category === cat);
                  if (firstInCat) setSelected(firstInCat);
                }}
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

        {/* CANDIDATES */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 gap-6 scrollbar-thin scrollbar-thumb-[#3a393b] scrollbar-track-transparent">
           <FireflyField count={150} />
         
          {filteredCandidates.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              className={`relative cursor-pointer rounded-xl border overflow-hidden transition-all duration-300 group hover:shadow-[0_0_10px_#bea25640] ${
                selected.id === c.id
                  ? "border-[#d8bd71] scale-[1.03] shadow-[0_0_5px_#d8bd71]"
                  : "border-[#3a393b] hover:border-[#bea256]"
              }`}
              style={{ height: "auto", minHeight: "280px" }}
            >
              {/* Candidate number (from data attribute) */}
              <div
                className="absolute top-2 left-2 z-20 bg-[#1b1a1d]/80 backdrop-blur-sm border border-[#d8bd71]/50 text-[#d8bd71] font-bold rounded-full w-10 h-10 flex items-center justify-center text-sm tracking-wider shadow-[0_0_6px_rgba(216,189,113,0.3)]"
                data-candidate-number={c.number}
              >
                {String(c.number).padStart(2, "0")}
              </div>

              {/* Image */}
              <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
                <img
                  src={c.img}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#1b1a1d]/80 via-transparent to-transparent" />
              </div>

              {/* Candidate info */}
              <div className="p-3 bg-[#222124] flex flex-col justify-center h-[90px]">
                <h3 className="text-base sm:text-lg font-semibold text-gray-300 truncate">
                  {c.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{c.representing}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 px-10 py-2 ">
        {/* NAVBAR */}
        <nav className="mb-8 border-b border-[#3a393b] pb-3 flex items-center justify-between">
          {/* Left: Logo / Title */}
          <h1 className="text-2xl font-bold tracking-wide text-gray-200">
            Judge Dashboard
          </h1>

          {/* Center: Navigation Links */}
          <ul className="flex items-center gap-10 text-sm font-semibold tracking-wide">
            {(
              [
                { id: "scoring", label: "Scoring Section" },
                { id: "dashboard", label: "Dashboard" },
                { id: "reports", label: "Reports & Analytics" },
              ] as { id: "scoring" | "dashboard" | "reports"; label: string }[]
            ).map((tab) => (
              <li
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative cursor-pointer transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-[#f7e9c2] after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-[#d8bd71] after:rounded-full"
                    : "text-[#bea256]/70 hover:text-[#f7e9c2]"
                }`}
              >
                {tab.label}
              </li>
            ))}
          </ul>

          {/* Right: Logout */}
          <button className="bg-[#d8bd71] text-[#1b1a1d] px-5 py-2 rounded-full font-semibold hover:bg-[#bea256] shadow-[0_0_10px_#bea25660] transition">
            Logout
          </button>
        </nav>

        {activeTab === "scoring" && (
          <>
            {/* CANDIDATE INFO */}
            <section className="flex items-start gap-8 mb-5">
              <div className="w-1/4">
                <img
                  src={selected.img}
                  alt={selected.name}
                  className="w-full rounded-lg border border-[#3a393b] shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-[#d8bd71] mb-1 flex items-center gap-3">
                  {selected.name}
                  <span className="text-sm bg-[#bea256]/10 border border-[#bea256]/40 px-3 py-1 rounded-full text-[#f7e9c2] font-semibold tracking-wide">
                    Total:11 pts
                  </span>
                </h2>
                <p className="text-gray-400 text-sm mb-2">
                  Category: {selected.category}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Representing: {selected.representing}
                </p>
              </div>
            </section>

            <ScoringSection
              criteria={criteria}
              scores={scores}
              handleScoreChange={handleScoreChange}
              highlightCategoryId="A"
            />
          </>
        )}

        {activeTab === "dashboard" && (
          <section className="mt-6 text-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-[#d8bd71]">
              My Scoring Dashboard
            </h2>
            <table className="w-full border-collapse border border-[#3a393b] text-sm">
              <thead>
                <tr className="bg-[#222124] text-[#bea256]">
                  <th className="border border-[#3a393b] px-3 py-2 text-left">
                    #
                  </th>
                  <th className="border border-[#3a393b] px-3 py-2 text-left">
                    Candidate
                  </th>
                  <th className="border border-[#3a393b] px-3 py-2 text-center">
                    Category
                  </th>
                  <th className="border border-[#3a393b] px-3 py-2 text-center">
                    Total Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-[#2a292c]/50 transition-colors duration-150"
                  >
                    <td className="border border-[#3a393b] px-3 py-2">
                      {c.number}
                    </td>
                    <td className="border border-[#3a393b] px-3 py-2">
                      {c.name}
                    </td>
                    <td className="border border-[#3a393b] px-3 py-2 text-center">
                      {c.category}
                    </td>
                    <td className="border border-[#3a393b] px-3 py-2 text-center">
                      {Object.values(scores).reduce((a, b) => a + (b || 0), 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === "reports" && (
          <section className="mt-6 text-gray-300">
            <h2 className="text-xl font-semibold mb-4 text-[#d8bd71]">
              Reports & Analytics
            </h2>
            <p className="text-gray-400">
              Coming soon: charts, average scores, and performance insights.
            </p>
          </section>
        )}

        {/* SCORING */}

        <footer className="mt-10 border-t border-[#3a393b] pt-4 text-center text-xs text-gray-500">
          © 2025 Pageant Tabulator — Designed with Elegance & Precision
        </footer>
      </div>
    </div>
  );
}
