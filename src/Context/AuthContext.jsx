import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/Axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/me")
      .then(({ data }) => {
        const savedProfile = JSON.parse(localStorage.getItem("inventory-profile") || "null");
        setUser({ ...savedProfile, email: data.data });
      })
      .catch(() => {
        localStorage.removeItem("inventory-profile");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const { data } = await api.post("/users/user-login", credentials);
    localStorage.setItem("inventory-profile", JSON.stringify(data.data));
    setUser(data.data);
  }

  async function logout() {
    try {
      await api.post("/users/user-logout");
    } finally {
      localStorage.removeItem("inventory-profile");
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
