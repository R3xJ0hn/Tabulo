import { PageantProvider, usePageant } from "./context/PageantContext";
import JudgePage from "./pages/JudgePage";
import LoginPage from "./pages/LoginPage";

function Router() {
  const { token } = usePageant();
  return token ? <JudgePage /> : <LoginPage />;
}

export default function App() {
  return (
    <PageantProvider>
      <Router />
    </PageantProvider>
  );
}
