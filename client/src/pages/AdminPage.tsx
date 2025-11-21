// src/pages/AdminPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { usePageant } from "../context/PageantContext";
import type { Candidate, Criterion } from "../types/pageant";

import AdminNav from "../components/admin/AdminNav";
import CandidatesList from "../components/admin/CandidatesList";
import CandidateForm from "../components/admin/CandidateForm";
import CriteriaList from "../components/admin/CriteriaList";
import AddCriteriaForm from "../components/admin/AddCriteriaForm";

export default function AdminPage() {
  const API = "http://localhost:3000";
  const { role, logout } = usePageant();

  const [activeTab, setActiveTab] = useState<"candidates" | "criteria">(
    "candidates"
  );

  // If not admin, block page
  if (role !== "admin") {
    window.location.href = "/";
    return null;
  }

  /* -----------------------------------
        CANDIDATES
  ----------------------------------- */
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(
    null
  );

  const loadCandidates = async () => {
    try {
      const res = await axios.get(`${API}/candidates`);
      setCandidates(res.data); // IDs included but NOT shown on UI
    } catch (err) {
      console.error("Failed to load candidates", err);
    }
  };

  const addCandidate = async (data: any) => {
    try {
      await axios.post(`${API}/candidates`, data);
      loadCandidates();
    } catch (err) {
      console.error("Failed to add candidate", err);
    }
  };

  const updateCandidate = async (id: number | string, data: any) => {
    try {
      await axios.put(`${API}/candidates/${id}`, data);
      setEditingCandidate(null);
      loadCandidates();
    } catch (err) {
      console.error("Failed to update candidate", err);
    }
  };

  const deleteCandidate = async (id: number | string) => {
    const confirmed = window.confirm(
      "Delete this candidate? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API}/candidates/${id}`);

      // close edit if the deleted one is being edited
      if (editingCandidate && String(editingCandidate.id) === String(id)) {
        setEditingCandidate(null);
      }

      loadCandidates();
    } catch (err) {
      console.error("Failed to delete candidate", err);
    }
  };

  /* -----------------------------------
        CRITERIA
  ----------------------------------- */
  const [criteria, setCriteria] = useState<Criterion[]>([]);

  const loadCriteria = async () => {
    try {
      const res = await axios.get(`${API}/criteria`);
      setCriteria(res.data);
    } catch (err) {
      console.error("Failed to load criteria", err);
    }
  };

  const saveCriteria = async (data: any) => {
    try {
      await axios.post(`${API}/criteria`, data);
      loadCriteria();
    } catch (err) {
      console.error("Failed to save criteria", err);
    }
  };

  /* -----------------------------------
        INITIAL LOAD
  ----------------------------------- */
  useEffect(() => {
    loadCandidates();
    loadCriteria();
  }, []);

  return (
    <div className="h-screen bg-[#1b1a1d] text-[#d8bd71] px-10 py-5">
      <AdminNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logout={logout}
      />

      {/* --------------------- CANDIDATES TAB --------------------- */}
      {activeTab === "candidates" && (
        <div className="grid grid-cols-2 gap-10">
          <CandidatesList
            candidates={candidates}
            onEdit={setEditingCandidate}
            onDelete={deleteCandidate}
          />

          <CandidateForm
            initialData={editingCandidate}
            onSubmit={(data) => {
              if (editingCandidate) {
                updateCandidate(editingCandidate.id, data);
              } else {
                addCandidate(data);
              }
            }}
            onCancel={() => setEditingCandidate(null)}
          />
        </div>
      )}

      {/* --------------------- CRITERIA TAB --------------------- */}
      {activeTab === "criteria" && (
        <div className="grid grid-cols-2 gap-10">
          <CriteriaList criteria={criteria} />
          <AddCriteriaForm onSave={saveCriteria} />
        </div>
      )}
    </div>
  );
}
