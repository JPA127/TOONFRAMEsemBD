import { RouterProvider } from "react-router";
import { router } from "./routes";
import { UserProvider } from "./contexts/UserContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}