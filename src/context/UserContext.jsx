import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  };

  const login = async (credentials) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (data.token) {
        document.cookie = `authToken=${data.token}; path=/; max-age=86400`;
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.detail || "Login failed" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    document.cookie = "authToken=; path=/; max-age=0";
    setUser(null);
    window.location.href = "/signin";
  };

  const fetchUser = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API}/auth/me/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, login, logout, getToken, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
