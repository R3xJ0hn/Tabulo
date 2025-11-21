import { useState, useRef, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { InputScore } from "./ui/InputScore";

import type { Criterion, Scores } from "../types/pageant";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";

/* -----------------------------
   PROPS TYPE
----------------------------- */
type ScoringSectionProps = {
  criteria: Criterion[];
  scores: Scores;
  handleScoreChange: (id: string, value: number) => void;
  highlightCategoryId?: string;
};

/* -----------------------------
   Component
----------------------------- */
export default function ScoringSection({
  criteria,
  scores,
  handleScoreChange,
  highlightCategoryId,
}: ScoringSectionProps) {
  const [openCard, setOpenCard] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const getTotalWeight = (c: Criterion) =>
    c.subcriteria?.reduce((sum, s) => sum + s.weight, 0) ?? c.weight;

  const getParentScore = (c: Criterion) => {
    if (!c.subcriteria) return scores[c.id] ?? 0;
    return c.subcriteria.reduce((sum, s) => sum + (scores[s.id] ?? 0), 0);
  };

  const hasMissingSubScores = (c: Criterion) =>
    c.subcriteria?.some((s) => scores[s.id] == null);

  const scrollToCard = (id: string) => {
    const container = scrollContainerRef.current;
    const target = sectionRefs.current[id];
    if (!container || !target) return;

    setTimeout(() => {
      container.scrollBy({
        top:
          target.getBoundingClientRect().top -
          container.getBoundingClientRect().top -
          40,
        behavior: "smooth",
      });
    }, 300);
  };

  const toggleCard = (id: string) => {
    setOpenCard((prev) => {
      const next = prev === id ? null : id;
      if (next) scrollToCard(next);
      return next;
    });
  };

  const rawOverall = useMemo(() => {
    let totalScore = 0;
    let totalWeight = 0;
    for (const c of criteria) {
      totalWeight += getTotalWeight(c);
      totalScore += getParentScore(c);
    }
    return totalWeight ? (totalScore / totalWeight) * 100 : 0;
  }, [criteria, scores]);

  const overallScore = useAnimatedNumber(rawOverall);

  const inputClass =
    "w-36 text-center bg-[#0f0f0f] text-[#f7e9c2] rounded-xl px-4 py-2 shadow-[inset_0_0_8px_rgba(190,162,86,0.06)] focus:ring-2 focus:ring-[#bea256] text-xl";

  return (
    <section className="h-full pb-4 bg-transparent">
      <div className="sticky top-0 z-20 bg-[#1b1a1d]/95 border-b border-[#333233] flex items-center justify-between px-3 pb-2">
        <h2 className="text-2xl font-bold tracking-wide text-[#bea256]">
          MY EVALUATION:
        </h2>
        <span className="text-lg font-semibold text-[#f7e9c2]">
          {overallScore.toFixed(2)}%
        </span>
      </div>

      <div
        ref={scrollContainerRef}
        className="overflow-y-auto p-4 pt-5 custom-scrollbar h-3/6"
      >
        {criteria.map((cr) => {
          const isOpen = openCard === cr.id;
          const totalWeight = getTotalWeight(cr);
          const parentScore = getParentScore(cr);
          const missing = hasMissingSubScores(cr);
          const percent = Math.min(100, (parentScore / totalWeight) * 100);
          const isHighlighted = highlightCategoryId === cr.id;

          const wrapperClass = `
            py-4 px-4 rounded-xl transition-all duration-300 mb-3 relative  bg-[#1b1a1d]/95 border-b border-[#333233] 
            ${
              isHighlighted
                ? "ring-2 ring-[#bcd4ff]"
                : isOpen
                ? "bg-[#191819] shadow-lg"
                : "hover:bg-[#141313]/60"
            }
            ${openCard && !isOpen && !isHighlighted ? "opacity-30" : ""}
          `;

          return (
            <div
              key={cr.id}
              ref={(el) => {
                sectionRefs.current[cr.id] = el;
              }}
              className={wrapperClass}
            >
              <button
                onClick={() => toggleCard(cr.id)}
                className="flex items-start justify-between w-full text-left"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-200">{cr.name}</h3>

                  <div className="relative w-44 h-1.5 bg-[#2b2b2c] rounded-full mt-2">
                    <div
                      className={`absolute h-full rounded-full transition-all ${
                        missing ? "bg-red-500" : "bg-[#bea256]"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <p className="text-sm mt-2 text-gray-500 italic">
                    Weight: {totalWeight}%
                    {cr.subcriteria && (
                      <span
                        className={`ml-3 ${
                          missing ? "text-red-400" : "text-green-300"
                        }`}
                      >
                        {missing ? "Missing sub-scores" : "Complete"}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${
                        missing ? "text-red-400" : "text-[#d8bd71]"
                      }`}
                    >
                      {parentScore}
                    </div>
                    <div className="text-sm text-gray-400">/ {totalWeight}</div>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-[#bea256]" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[#bea256]" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div
                  className={`transition-all overflow-hidden ${
                    isOpen
                      ? "max-h-[720px] mt-3 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {cr.subcriteria ? (
                    <div className="space-y-3 mx-4 border-l border-[#2b2b2b] pl-4">
                      {cr.subcriteria.map((sub) => (
                        <InputScore
                          key={sub.id}
                          label={sub.name}
                          weight={sub.weight}
                          value={scores[sub.id]}
                          onChange={(v) => handleScoreChange(sub.id, v)}
                          inputClass={inputClass}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="ml-4 mt-2 mx-4 border-l border-[#2b2b2b] pl-4">
                      <InputScore
                        label={cr.name}
                        weight={cr.weight}
                        value={scores[cr.id]}
                        onChange={(v) => handleScoreChange(cr.id, v)}
                        inputClass={inputClass}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
