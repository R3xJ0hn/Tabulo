// src/components/admin/CriteriaForm.tsx
import { useState, useEffect } from "react";
import type { Criterion } from "../../types/pageant";

type CriteriaFormProps = {
  initialData?: Criterion | null;   // <-- null = Add mode, object = Edit mode
  onSubmit: (data: Criterion) => void;
  onCancel?: () => void;
};

export default function CriteriaForm({
  initialData,
  onSubmit,
  onCancel,
}: CriteriaFormProps) {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    id: "",
    name: "",
    weight: "",
    subcriteria: [] as { id: string; name: string; weight: number }[],
  });

  const [subName, setSubName] = useState("");
  const [subWeight, setSubWeight] = useState("");

  // Prefill when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        name: initialData.name,
        weight: String(initialData.weight),
        subcriteria: initialData.subcriteria || [],
      });
    }
  }, [initialData]);

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
    const payload: Criterion = {
      id: form.id,
      name: form.name,
      weight: Number(form.weight),
      subcriteria: form.subcriteria,
    };

    onSubmit(payload);
  }

  return (
    <div className="bg-[#222124] p-6 rounded-xl border border-[#3a393b] w-full">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit Criteria" : "Add Criteria"}
      </h2>

      {/* ID */}
      <input
        placeholder="ID (A, B, C)"
        className="p-2 bg-[#1b1a1d] border border-[#3a393b] rounded mb-2 w-full text-gray-300"
        value={form.id}
        onChange={(e) => setForm({ ...form, id: e.target.value })}
      />

      {/* NAME */}
      <input
        placeholder="Name"
        className="p-2 bg-[#1b1a1d] border border-[#3a393b] rounded mb-2 w-full text-gray-300"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      {/* WEIGHT */}
      <input
        placeholder="Weight"
        type="number"
        className="p-2 bg-[#1b1a1d] border border-[#3a393b] rounded mb-4 w-full text-gray-300"
        value={form.weight}
        onChange={(e) => setForm({ ...form, weight: e.target.value })}
      />

      {/* SUBCRITERIA */}
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
            className="bg-[#bea256] text-[#1b1a1d] px-3 rounded font-semibold"
          >
            +
          </button>
        </div>

        {/* LIST SUBCRITERIA */}
        <ul className="text-gray-400 text-sm ml-4">
          {form.subcriteria.map((s) => (
            <li key={s.id}>
              {s.name} — {s.weight}%
            </li>
          ))}
        </ul>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={save}
          className="flex-1 bg-[#d8bd71] text-[#1b1a1d] p-2 rounded font-semibold"
        >
          {isEdit ? "Save Changes" : "Add Criteria"}
        </button>

        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 bg-[#444] text-gray-200 p-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
