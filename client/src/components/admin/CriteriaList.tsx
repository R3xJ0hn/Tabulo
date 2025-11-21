// src/components/admin/CriteriaList.tsx
import type { Criterion } from "../../types/pageant";
import { Pencil, Trash2 } from "lucide-react"; // <-- ICONS

type CriteriaListProps = {
  criteria: Criterion[];
  onEdit: (criteria: Criterion) => void;
  onDelete: (id: string) => void;
};

export default function CriteriaList({ criteria, onEdit, onDelete }: CriteriaListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Criteria</h2>

      {/* Scroll wrapper */}
      <div className="max-h-140 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {criteria.map((cr) => (
          <div
            key={cr.id}
            className="p-4 bg-[#222124] border border-[#3a393b] rounded-xl"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-[#f7e9c2]">
                {cr.id} — {cr.name} ({cr.weight}%)
              </h3>

              {/* ICON ACTIONS */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(cr)}
                  className="p-2 rounded bg-[#bea256] text-[#1b1a1d] hover:bg-[#d8bd71] transition"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => onDelete(cr.id)}
                  className="p-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {cr.subcriteria && (
              <ul className="mt-2 ml-4 text-sm text-gray-400">
                {cr.subcriteria.map((s) => (
                  <li key={s.id}>
                    {s.name} — {s.weight}%
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
