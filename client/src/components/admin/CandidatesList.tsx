// src/components/admin/CandidatesList.tsx
import { useState } from "react";
import type { Candidate } from "../../types/pageant";
import { Pencil, Trash2 } from "lucide-react";

type CandidatesListProps = {
  candidates: Candidate[];
  onEdit: (c: Candidate) => void;
  onDelete: (id: number | string) => void;
  className?: string;
};

export default function CandidatesList({
  candidates,
  onEdit,
  onDelete,
  className = "",
}: CandidatesListProps) {
  const [activeGender, setActiveGender] = useState<"Male" | "Female">("Male");

  const filtered = candidates.filter(
    (c) => c.category?.toLowerCase() === activeGender.toLowerCase()
  );

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#d8bd71]">Candidate List</h2>

        <div className="flex gap-3">
          <button
            onClick={() => setActiveGender("Male")}
            className={`px-5 py-2 rounded-lg font-semibold border transition ${
              activeGender === "Male"
                ? "bg-[#d8bd71] text-[#1b1a1d] border-[#d8bd71]"
                : "bg-transparent text-gray-300 border-[#3a393b] hover:bg-[#3a393b]"
            }`}
          >
            Male
          </button>

          <button
            onClick={() => setActiveGender("Female")}
            className={`px-5 py-2 rounded-lg font-semibold border transition ${
              activeGender === "Female"
                ? "bg-[#d8bd71] text-[#1b1a1d] border-[#d8bd71]"
                : "bg-transparent text-gray-300 border-[#3a393b] hover:bg-[#3a393b]"
            }`}
          >
            Female
          </button>
        </div>
      </div>

      {/* WRAPPER WITH SCROLL */}
      <div className="border border-[#3a393b] rounded-lg overflow-hidden">
        <div className="max-h-140 overflow-y-auto overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-gray-200">
            <thead className="bg-[#1c1b1f] text-[#d8bd71] border-b border-[#3a393b] sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left border-r border-[#3a393b] w-20">
                  Pic
                </th>

                <th className="p-3 text-left border-r border-[#3a393b] w-20">
                  No.
                </th>

                <th className="p-3 text-left border-r border-[#3a393b]">
                  Name
                </th>
                <th className="p-3 text-left border-r border-[#3a393b]">
                  Category
                </th>
                <th className="p-3 text-left w-32">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[#3a393b] hover:bg-[#2a292d] transition"
                >
                  {/* IMAGE */}
                  <td className="p-3 border-r border-[#3a393b]">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#333]">
                      {c.img ? (
                        <img
                          src={c.img}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-3 border-r border-[#3a393b]">{c.number}</td>
                  <td className="p-3 border-r border-[#3a393b]">{c.name}</td>
                  <td className="p-3 border-r border-[#3a393b]">
                    {c.category}
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => onEdit(c)}
                      className="p-2 rounded-lg bg-[#d8bd71] text-[#1b1a1d] hover:bg-[#e6cd92] transition"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(c.id)}
                      className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-4 text-center text-gray-400">
            No {activeGender} candidates found.
          </div>
        )}
      </div>
    </div>
  );
}
