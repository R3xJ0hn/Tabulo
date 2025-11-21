// src/components/admin/CandidateForm.tsx
import { useState, useEffect, type DragEvent } from "react";
import { motion } from "framer-motion";
import type { Candidate } from "../../types/pageant";

type CandidateFormProps = {
  initialData?: Candidate | null;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
};

export default function CandidateForm({
  initialData,
  onSubmit,
  onCancel,
}: CandidateFormProps) {
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState({
    id: "",
    number: "",
    name: "",
    category: "Male",
    representing: "",
    img: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  /* Load existing data when editing */
  useEffect(() => {
    if (initialData) {
      setForm({
        id: String(initialData.id),
        number: String(initialData.number),
        name: initialData.name,
        category: initialData.category as "Male" | "Female",
        representing: initialData.representing || "",
        img: initialData.img || "",
      });

      setPreview(initialData.img || null);
    }
  }, [initialData]);

  /* Image upload handler */
  function handleImgUpload(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setForm({ ...form, img: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  /* Drag + drop */
  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImgUpload(file);
    }
  }

  /* Submit */
  function handleSubmit() {
    const payload = {
      ...form,
      id: Number(form.id),
      number: Number(form.number),
    };

    onSubmit(payload);

    if (!isEdit) {
      setForm({
        id: "",
        number: "",
        name: "",
        category: "Male",
        representing: "",
        img: "",
      });
      setPreview(null);
    }
  }

  return (
    <motion.div
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 80, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className=" bg-[#1c1b1f] p-6 rounded-2xl border border-[#353438] shadow-xl max-h-160"
    >
      {/* Title */}
      <h2 className="text-2xl font-semibold text-[#d8bd71] mb-6 tracking-wide">
        {isEdit ? "Edit Candidate" : "Add Candidate"}
      </h2>

      {/* IMAGE UPLOAD */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onClick={() => document.getElementById("fileInput")?.click()}
        className={`rounded-xl border-2 p-2 cursor-pointer transition-all 
          w-40 h-40 mx-auto flex items-center justify-center
          ${dragActive ? "border-[#d8bd71] bg-[#2b2a2f]" : "border-[#3a383c] bg-[#1a191c]"}`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg border border-[#3a383c]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 text-center text-xs px-2">
            <p>Drag an image here</p>
            <p className="opacity-70">or click to upload</p>
          </div>
        )}

        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImgUpload(file);
          }}
        />
      </div>

      {/* FORM FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

        {/* NUMBER */}
        <div>
          <label className="text-sm text-gray-400">NUMBER</label>
          <input
            className="mt-1 w-full p-3 bg-[#131215] border border-[#2f2d30] rounded-lg 
              text-gray-200 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-[#d8bd71]"
            placeholder="Enter number"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="text-sm text-gray-400">CATEGORY</label>
          <select
            className="mt-1 w-full p-3 bg-[#131215] border border-[#2f2d30] rounded-lg 
              text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8bd71]"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as "Male" | "Female" })
            }
          >
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        {/* NAME — FULL WIDTH */}
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">NAME</label>
          <input
            className="mt-1 w-full p-3 bg-[#131215] border border-[#2f2d30] rounded-lg 
              text-gray-200 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-[#d8bd71]"
            placeholder="Enter name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* REPRESENTING — FULL WIDTH */}
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">REPRESENTING</label>
          <input
            className="mt-1 w-full p-3 bg-[#131215] border border-[#2f2d30] rounded-lg 
              text-gray-200 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-[#d8bd71]"
            placeholder="Enter representing"
            value={form.representing}
            onChange={(e) => setForm({ ...form, representing: e.target.value })}
          />
        </div>

      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSubmit}
          className="flex-1 p-3 rounded-lg font-semibold
          bg-[#d8bd71] text-[#1c1b1f] tracking-wide
          hover:bg-[#e6cd92] transition-all shadow"
        >
          {isEdit ? "Save Changes" : "Add Candidate"}
        </button>

        {isEdit && onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 p-3 rounded-lg font-semibold
              bg-[#3e3d41] text-gray-200
              hover:bg-[#565558] transition-all shadow"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.div>
  );
}
