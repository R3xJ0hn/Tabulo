import { useState } from "react";
import { usePageant } from "../context/PageantContext";
import FireflyField from "../components/fx/FireflyField";

export default function LoginPage() {
  const { login, token } = usePageant();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative h-screen w-full bg-[#1b1a1d] flex items-center justify-center overflow-hidden">
      {/* Background Fireflies */}
      <FireflyField count={120} />

      {/* Login Box */}
      <div className="relative z-10 bg-[#222124]/80 backdrop-blur-xl border border-[#3a393b] p-10 rounded-2xl shadow-2xl w-[380px]">
        
        <h1 className="text-center text-3xl font-bold text-[#d8bd71] mb-6 tracking-wide">
          Judge Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div>
            <label className="text-[#bea256] text-sm font-semibold">
              Username
            </label>
            <input
              type="text"
              className="w-full mt-1 p-3 rounded-lg bg-[#111011] border border-[#3a393b] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8bd71]"
              placeholder="Enter username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-[#bea256] text-sm font-semibold">
              Password
            </label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded-lg bg-[#111011] border border-[#3a393b] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8bd71]"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-400 text-sm font-medium text-center">
              {error}
            </div>
          )}

          {/* Button */}
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
