import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

interface AuthStatus {
  checked: boolean;
  isAuthenticated: boolean;
}

interface AuthAdmin {
  checked: boolean;
  isAdmin: boolean;
}
interface UserInfo {
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  authStatus: AuthStatus;
  authAdmin: AuthAdmin;
  userInfo: UserInfo;
  verifySession: () => Promise<void>;
  verifyAdmin: () => Promise<void>;
  logout: () => Promise<void>;
}
interface Props {
  children: React.ReactNode;
}

const defaultState = {
  authStatus: { checked: false, isAuthenticated: false },
  authAdmin: { checked: false, isAdmin: false },
  userInfo: { name: "", email: "", avatar: "" },
  verifySession: async () => {},
  verifyAdmin: async () => {},
  logout: async () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultState);

export const AuthProvider = ({ children }: Props) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(
    defaultState.authStatus
  );
  const [authAdmin, setAuthAdmin] = useState<AuthAdmin>(defaultState.authAdmin);
  const [userInfo, setUserInfo] = useState<UserInfo>(defaultState.userInfo);
  const BaseUrl = import.meta.env.VITE_BASE_URL;

  const verifySession = useCallback(async () => {
    try {
      const res = await axios.get(`${BaseUrl}/api/verify-session`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setAuthStatus({ checked: true, isAuthenticated: true });

        // Immediately try to verify admin status if authenticated
      }
    } catch (error) {
      setAuthStatus({ checked: true, isAuthenticated: false });
    }
  }, []);

  const token = localStorage.getItem("token");

  const verifyAdmin = useCallback(async () => {
    if (!token) {
      setAuthAdmin({ checked: true, isAdmin: false });
      return;
    }
    try {
      const res = await axios.get(`${BaseUrl}/api/verify-admin`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setAuthAdmin({ checked: true, isAdmin: true });
      } else {
        setAuthAdmin({ checked: true, isAdmin: false });
      }
    } catch (error) {
      setAuthAdmin({ checked: false, isAdmin: false });
    }
  }, [token]);

  useEffect(() => {
    const verifyAuth = async () => {
      await verifySession();
      await verifyAdmin();
    };

    verifyAuth();
  }, [token, verifySession, verifyAdmin]);

  const logout = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/api/logout`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        localStorage.removeItem("token");
        setAuthStatus({ checked: true, isAuthenticated: false });
        setAuthAdmin({ checked: true, isAdmin: false });
        setUserInfo(defaultState.userInfo);
      } else {
        console.error("An error occurred during logout");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  useEffect(() => {
    if (authStatus.checked && authStatus.isAuthenticated) {
      verifyAdmin();
    }
  }, [authStatus.checked, authStatus.isAuthenticated, verifyAdmin]);

  return (
    <AuthContext.Provider
      value={{
        authStatus,
        userInfo,
        authAdmin,
        verifySession,
        verifyAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
