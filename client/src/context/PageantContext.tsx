import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import type { Candidate, Criterion, Scores } from "../types/pageant";

type PageantContextType = {
  candidates: Candidate[];
  criteria: Criterion[];
  selectedCandidate: Candidate | null;
  scores: Scores;

  token: string | null;
  judgeId: number | null;
  role: string | null;   // ✅ ADDED

  setSelectedCandidate: (c: Candidate) => void;
  updateScore: (criterionId: string, value: number) => void;

  loadScoresFromDB: (candidateId: number) => Promise<void>;
  saveScoresToDB: (candidateId: number) => Promise<void>;

  login: (username: string, password: string) => Promise<string>; // ✅ FIXED
  logout: () => void;
};

// ----------------------------------------------------
const PageantContext = createContext<PageantContextType | undefined>(undefined);

// ----------------------------------------------------
export const PageantProvider = ({ children }: { children: React.ReactNode }) => {
  const API = "http://localhost:3000";

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);
  const [scores, setScores] = useState<Scores>({});

  // ------------------------------
  // Authentication state
  // ------------------------------
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [judgeId, setJudgeId] = useState<number | null>(
    localStorage.getItem("judgeId")
      ? Number(localStorage.getItem("judgeId"))
      : null
  );

  const [role, setRole] = useState<string | null>(
    localStorage.getItem("role") || null
  );

  // Axios instance with token
  const axiosAuth = axios.create({
    baseURL: API,
  });

  axiosAuth.interceptors.request.use((config) => {
    if (token) {
      config.headers = config.headers || new axios.AxiosHeaders();
      (config.headers as any).set
        ? (config.headers as any).set("Authorization", `Bearer ${token}`)
        : ((config.headers as any)["Authorization"] = `Bearer ${token}`);
    }
    return config;
  });

  // ------------------------------
  // Initial load: candidates & criteria
  // ------------------------------
  useEffect(() => {
    axios.get(`${API}/criteria`).then((res) => setCriteria(res.data));

    axios.get(`${API}/candidates`).then((res) => {
      setCandidates(res.data);
      if (res.data.length > 0) setSelectedCandidate(res.data[0]);
    });
  }, []);

  // ------------------------------
  // Update score locally
  // ------------------------------
  function updateScore(id: string, value: number) {
    setScores((prev) => ({ ...prev, [id]: value }));
  }

  // ------------------------------
  // Load judge-specific scores
  // ------------------------------
  async function loadScoresFromDB(candidateId: number) {
    try {
      const res = await axiosAuth.get(`/scores/${candidateId}`);
      setScores(res.data || {});
    } catch (err) {
      console.error("Failed to load scores:", err);
      setScores({});
    }
  }

  // ------------------------------
  // Save scores for this judge
  // ------------------------------
  async function saveScoresToDB(candidateId: number) {
    try {
      await axiosAuth.post(`/scores/save`, {
        candidateId,
        scores,
      });
    } catch (err) {
      console.error("Failed to save scores:", err);
    }
  }

  // ------------------------------
  // LOGIN (Admin OR Judge)
  // ------------------------------
  async function login(username: string, password: string): Promise<string> {
    const res = await axios.post(`${API}/auth/login`, {
      username,
      password,
    });

    const { token, role, userId } = res.data;

    setToken(token);
    setRole(role);

    // Save judgeId ONLY for judges
    if (role === "judge") {
      setJudgeId(userId);
      localStorage.setItem("judgeId", String(userId));
    }

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", String(userId));

    return role;
  }

  // ------------------------------
  // LOGOUT
  // ------------------------------
  function logout() {
    setToken(null);
    setJudgeId(null);
    setRole(null);

    localStorage.removeItem("token");
    localStorage.removeItem("judgeId");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    window.location.href = "/";
  }

  // ------------------------------
  return (
    <PageantContext.Provider
      value={{
        candidates,
        criteria,
        selectedCandidate,
        scores,

        token,
        judgeId,
        role,

        setSelectedCandidate,
        updateScore,

        loadScoresFromDB,
        saveScoresToDB,

        login,
        logout,
      }}
    >
      {children}
    </PageantContext.Provider>
  );
};

// ----------------------------------------------------
export function usePageant() {
  const ctx = useContext(PageantContext);
  if (!ctx) throw new Error("usePageant must be used inside PageantProvider");
  return ctx;
}
