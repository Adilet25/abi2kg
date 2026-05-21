import { RouterProvider } from "react-router";
import { LanguageProvider } from "./contexts/LanguageContext";
import { router } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </LanguageProvider>
  );
}
