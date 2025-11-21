import { useState } from "react";

type AddCriteriaFormProps = {
  onSave: (data: any) => void;
};

export default function AddCriteriaForm({ onSave }: AddCriteriaFormProps) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    weight: "",
    subcriteria: [] as {
      id: string;
      name: string;
      weight: number;
    }[],
  });

  const [subName, setSubName] = useState("");
  const [subWeight, setSubWeight] = useState("");

  function addSub() {
    if (!subName || !subWeight) return;

    setForm((prev) => ({
      ...prev,
      subcriteria: [
        ...prev.subcriteria,
        {
          id: prev.id + (prev.subcriteria.length + 1),
          name: subName,
          weight: Number(subWeight),
        },
      ],
    }));

    setSubName("");
    setSubWeight("");
  }

  function save() {
    const payload = {
      ...form,
      weight: Number(form.weight),
      subcriteria: form.subcriteria.length ? form.subcriteria : null,
    };

    onSave(payload);
  }

  return (
  <div className="bg-[#222124] p-6 rounded-xl border border-[#3a393b]">
      <h2 className="text-xl font-semibold mb-4">Add Criteria</h2>

      <input
        placeholder="ID (A, B, C)"
        className="p-2 bg-[#1b1a1d] border border-[#3a393b] rounded mb-2 w-full text-gray-300"
        value={form.id}
        onChange={(e) => setForm({ ...form, id: e.target.value })}
      />

      <input
        placeholder="Name"
        className="p-2 bg-[#1b1a1d] border border-[#3a393b] rounded mb-2 w-full text-gray-300"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Weight"
        type="number"
        className="p-2 bg-[#1b1a1d] border border-[#3a393b] rounded mb-4 w-full text-gray-300"
        value={form.weight}
        onChange={(e) => setForm({ ...form, weight: e.target.value })}
      />

      <div className="border-t border-[#3a393b] pt-3">
        <h3 className="text-[#bea256] mb-2 font-semibold">Subcriteria</h3>

        <div className="flex gap-2 mb-2">
          <input
            placeholder="Subcriteria Name"
            className="p-2 bg-[#1b1a1d] border border-[#3a393b] rounded w-full text-gray-300"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
          />

          <input
            placeholder="Weight"
            type="number"
            className="p-2 bg-[#1b1a1d] border border-[#3a393b] rounded w-32 text-gray-300"
            value={subWeight}
            onChange={(e) => setSubWeight(e.target.value)}
          />

          <button
            onClick={addSub}
            className="bg-[#bea256] text-[#1b1a1d] px-3 rounded"
          >
            +
          </button>
        </div>

        <ul className="text-gray-400 text-sm ml-4">
          {form.subcriteria.map((s) => (
            <li key={s.id}>
              {s.name} — {s.weight}%
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={save}
        className="mt-4 w-full bg-[#d8bd71] text-[#1b1a1d] p-2 rounded font-semibold"
      >
        Save Criteria
      </button>
    </div>
  );
}
