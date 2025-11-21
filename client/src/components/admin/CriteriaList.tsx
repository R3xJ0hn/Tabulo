import type { Criterion } from "../../types/pageant";

type CriteriaListProps = {
  criteria: Criterion[];
};

export default function CriteriaList({ criteria }: CriteriaListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Criteria</h2>

      <div className="space-y-4">
        {criteria.map((cr) => (
          <div
            key={cr.id}
            className="p-4 bg-[#222124] border border-[#3a393b] rounded-xl"
          >
            <h3 className="font-semibold text-[#f7e9c2]">
              {cr.id} — {cr.name} ({cr.weight}%)
            </h3>

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
