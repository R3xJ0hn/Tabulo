// src/components/admin/EditCandidateForm.tsx
import { useState } from "react";
import type { Candidate } from "../../types/pageant";

type EditCandidateFormProps = {
  candidate: Candidate;
  onUpdate: (data: any) => void; // call with updated payload (doesn't include id)
  onCancel: () => void;
};

type CandidateField = "id" | "number" | "name" | "representing" | "img";

export default function EditCandidateForm({ candidate, onUpdate, onCancel }: EditCandidateFormProps) {
  const [form, setForm] = useState({
    id: String(candidate.id ?? ""),
    number: String(candidate.number ?? ""),
    name: candidate.name ?? "",
    category: (candidate.category as "Male" | "Female") ?? "Male",
    representing: candidate.representing ?? "",
    img: candidate.img ?? "",
  });

  function save() {
    const payload = {
      ...form,
      id: Number(form.id),
      number: Number(form.number),
    };
    onUpdate(payload);
  }

  return (
    <div className="bg-[#222124] p-6 rounded-xl border border-[#3a393b]">
      <h2 className="text-xl font-semibold mb-4">Edit Candidate</h2>

      <div className="flex flex-col gap-3">
        {(["id", "number", "name", "representing", "img"] as CandidateField[]).map((field) => (
          <input
            key={field}
            placeholder={field.toUpperCase()}
            className="p-2 bg-[#1b1a1d] border border-[#3a393b] rounded text-gray-300"
            value={(form as any)[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}

        <select
          className="p-2 bg-[#1b1a1d] border border-[#3a393b] rounded text-gray-300"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value as "Male" | "Female" })}
        >
          <option>Male</option>
          <option>Female</option>
        </select>

        <div className="flex gap-2 mt-2">
          <button onClick={save} className="bg-[#d8bd71] text-[#1b1a1d] p-2 rounded font-semibold">
            Save
          </button>
          <button onClick={onCancel} className="bg-gray-600 text-white p-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
