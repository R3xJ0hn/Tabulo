type AdminTab = "candidates" | "criteria" | "judges";

type AdminNavProps = {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  logout: () => void;
};

export default function AdminNav({
  activeTab,
  setActiveTab,
  logout,
}: AdminNavProps) {
  return (
    <nav className="flex items-center justify-between mb-4 border-b border-[#3a393b] pb-2">
      <h1 className="text-3xl font-bold tracking-wide text-gray-300">
        Admin Dashboard
      </h1>

      <div className="flex items-center gap-10 text-lg">
        <ul className="flex gap-10">
          {(["candidates", "criteria", "judges"] as AdminTab[]).map((tab) => (
            <li
              key={tab}
              className={`cursor-pointer capitalize transition-all pb-1
                ${
                  activeTab === tab
                    ? "text-[#f7e9c2] border-b-2 border-[#d8bd71]"
                    : "text-[#bea256]/70 hover:text-[#f7e9c2]"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>

        <button
          onClick={logout}
          className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
