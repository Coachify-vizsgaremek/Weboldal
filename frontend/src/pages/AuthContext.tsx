import { createContext, useContext, useState, useEffect } from "react";
import { getProtectedData, getUserData } from "../api";

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
      // First try the /api/user endpoint
      const userResponse = await getUserData();
      
      if (userResponse.data) {
        setIsLoggedIn(true);
        setUserName(userResponse.data.full_name);
        setUserRole(userResponse.data.role);
        return;
      }
      
      // Fall back to /protected endpoint if needed
      const protectedResponse = await getProtectedData();
      
      if (protectedResponse.user) {
        setIsLoggedIn(true);
        setUserName(protectedResponse.user.full_name);
        setUserRole(protectedResponse.user.role);
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
    await refreshUserData();
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