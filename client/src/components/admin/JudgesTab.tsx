// src/components/admin/AdminJudgesTab.tsx
import { useState, useEffect } from "react";

type Judge = {
  id: number;
  username: string;
  role: string;
};

export default function AdminJudgesTab() {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [form, setForm] = useState({
    id: null as number | null,
    username: "",
    password: "",
  });
  const [editing, setEditing] = useState(false);

  /* ============================
     LOAD JUDGES
  ============================= */
  async function loadJudges() {
    try {
      const res = await fetch("http://localhost:3000/judges");
      const data = await res.json();
      setJudges(data);
    } catch (err) {
      console.error("Failed to load judges:", err);
    }
  }

  useEffect(() => {
    loadJudges();
  }, []);

  /* ============================
     INPUT HANDLER
  ============================= */
  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  /* ============================
     SUBMIT (ADD / UPDATE)
  ============================= */
  async function handleSubmit(e: any) {
    e.preventDefault();

    const payload: any = {
      username: form.username,
    };

    if (!editing || form.password.trim() !== "") {
      payload.password = form.password;
    }

    try {
      let url = "http://localhost:3000/judges";
      let method = "POST";

      if (editing && form.id !== null) {
        url = `http://localhost:3000/judges/${form.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save judge");

      setForm({ id: null, username: "", password: "" });
      setEditing(false);
      loadJudges();
    } catch (err) {
      console.error(err);
    }
  }

  /* ============================
     EDIT JUDGE
  ============================= */
  function handleEdit(judge: Judge) {
    setForm({
      id: judge.id,
      username: judge.username,
      password: "",
    });
    setEditing(true);
  }

  /* ============================
     DELETE JUDGE
  ============================= */
  async function handleDelete(id: number) {
    if (!confirm("Delete this judge?")) return;

    try {
      await fetch(`http://localhost:3000/judges/${id}`, { method: "DELETE" });
      loadJudges();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  /* ============================
     UI
  ============================= */
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Judge Accounts</h2>

      {/* 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT — FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-900 p-4 rounded-xl border border-neutral-700"
        >
          <h3 className="text-xl mb-4">{editing ? "Edit Judge" : "Add Judge"}</h3>

          <div className="flex flex-col gap-3">

            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="p-2 rounded bg-neutral-800 border border-neutral-700"
              placeholder="Username"
              required
            />

            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              className="p-2 rounded bg-neutral-800 border border-neutral-700"
              placeholder={editing ? "New Password (optional)" : "Password"}
              type="password"
              required={!editing}
            />

            <button
              className="mt-2 bg-[#d8bd71] text-black p-2 rounded-lg hover:bg-[#e4c880] transition"
              type="submit"
            >
              {editing ? "Update Judge" : "Add Judge"}
            </button>
          </div>
        </form>

        {/* RIGHT — LIST */}
        <div>
          <h3 className="text-xl mb-2">Judge List</h3>

          <div className="rounded-xl border border-neutral-700 overflow-hidden">

            {/* STICKY HEADER */}
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-800 sticky top-0 z-10">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Username</th>
                  <th className="p-3 w-32">Actions</th>
                </tr>
              </thead>
            </table>

            {/* SCROLLABLE BODY */}
            <div className="max-h-[480px] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <tbody>
                  {judges.map((judge) => (
                    <tr
                      key={judge.id}
                      className="border-t border-neutral-700 hover:bg-neutral-800/40"
                    >
                      <td className="p-3">{judge.id}</td>
                      <td className="p-3">{judge.username}</td>

                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleEdit(judge)}
                          className="px-2 py-1 bg-blue-600 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(judge.id)}
                          className="px-2 py-1 bg-red-600 rounded"
                        >
                          Del
                        </button>
                      </td>
                    </tr>
                  ))}

                  {judges.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center p-4 text-neutral-400">
                        No judges yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
