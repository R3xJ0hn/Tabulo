import { PageantProvider, usePageant } from "./context/PageantContext";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import JudgePage from "./pages/JudgePage";

function Router() {
  const { token, role } = usePageant();

  if (!token || !role) {
    return <LoginPage />;
  }

  if (role === "admin") {
    return <AdminPage />;
  }

  if (role === "judge") {
    return <JudgePage />;
  }

  return <LoginPage />;
}

export default function App() {
  return (
    <PageantProvider>
      <Router />
    </PageantProvider>
  );
}
