import { useState } from "react";
import { usePageant } from "../context/PageantContext";
import FireflyField from "../components/fx/FireflyField";

export default function LoginPage() {
  const { login } = usePageant();
  

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const role = await login(username, password);

      // Auto-redirect depending on role
      if (role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/judge";
      }

    } catch (err: any) {
      setError(err?.response?.data?.error || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative h-screen w-full bg-[#1b1a1d] flex items-center justify-center overflow-hidden">
      <FireflyField count={120} />

      <div className="relative z-10 bg-[#222124]/80 backdrop-blur-xl border border-[#3a393b] p-10 rounded-2xl shadow-2xl w-[380px]">
        
        <h1 className="text-center text-3xl font-bold text-[#d8bd71] mb-6 tracking-wide">
          Pageant Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="text-[#bea256] text-sm font-semibold">
              Username
            </label>
            <input
              type="text"
              className="w-full mt-1 p-3 rounded-lg bg-[#111011] border border-[#3a393b] text-gray-200"
              placeholder="Enter username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[#bea256] text-sm font-semibold">
              Password
            </label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded-lg bg-[#111011] border border-[#3a393b] text-gray-200"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full font-semibold text-[#1b1a1d] transition ${
              loading
                ? "bg-[#bea256]/60 cursor-not-allowed"
                : "bg-[#d8bd71] hover:bg-[#bea256] shadow-[0_0_10px_#bea25660]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
