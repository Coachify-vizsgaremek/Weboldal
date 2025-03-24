import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  userRole: string;
  login: (name: string, role: string) => void;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  const refreshUserData = async () => {
    try {
      const response = await fetch('http://localhost:3000/protected', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUserName(data.user.full_name);
        setUserRole(data.user.role);
      } else {
        clearAuthState();
      }
    } catch (error) {
      console.error("Auth check error:", error);
      clearAuthState();
    }
  };

  const clearAuthState = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserRole("");
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  const login = async (name: string, role: string) => {
    setIsLoggedIn(true);
    setUserName(name);
    setUserRole(role);
    await refreshUserData(); // Force refresh after login
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include'
      });
      clearAuthState();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      userName, 
      userRole, 
      login, 
      logout,
      refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};