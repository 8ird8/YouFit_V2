import { createContext, useState, useCallback } from "react";
import axios from "axios";

interface Props {
  children: React.ReactNode;
}

interface UserInfo {
  userId: string;
  avatar: string;
  username: string;
  email: string;
  weight: string;
  role : string ;
  gender: string;
  level: string;
  goal: string;

}

interface UserContextType {
  TokenInfo: UserInfo;
  currentUserInfo: UserInfo;
  isLoading: boolean; // New state to indicate loading
  fetchTokenInfo: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  TokenInfo: { userId: "", avatar: "", username: "", email: "", weight: "",role: "",gender: "",  level: "", goal: "",},
  currentUserInfo: {
    userId: "",
    avatar: "",
    username: "",
    email: "",
    weight: "",
    role:"",
    gender: "",
    level: "",
    goal: "",
  },
  isLoading: true, // Initially true
  fetchTokenInfo: async () => {},
  fetchCurrentUser: async () => {},
});

export const UserProvider = ({ children }: Props) => {
  const [TokenInfo, setTokenInfo] = useState<UserInfo>({
    userId: "",
    avatar: "",
    username: "",
    email: "",
    weight: "",
    role: "",
    gender: "",
    level: "",
    goal: "",
  });
  const [currentUserInfo, setCurrentUserInfo] = useState<UserInfo>({
    userId: "",
    avatar: "",
    username: "",
    email: "",
    weight: "",
    role: "",
    gender: "",
    level: "",
    goal: "",
  });

  const [isLoading, setIsLoading] = useState(true); // Manage loading state

  const fetchTokenInfo = useCallback(async () => {
    setIsLoading(true); 
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await axios.get("http://localhost:3000/api/userbytoken", {
          withCredentials: true,
        });

        if (res.status === 200) {
          setTokenInfo(res.data.TokenInfo);
          await fetchCurrentUser(); // Ensure current user is fetched before stopping loading
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    }
    setIsLoading(false); // Stop loading
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    if (TokenInfo.userId) {
      try {
        const res = await axios.get(`http://localhost:3000/api/user/${TokenInfo.userId}`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          setCurrentUserInfo(res.data.currentUserInfo);
        } else {
          console.error("An error occurred while fetching user with that id");
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    }
  }, [TokenInfo.userId]);

  return (
    <UserContext.Provider
      value={{ TokenInfo, currentUserInfo, isLoading, fetchTokenInfo, fetchCurrentUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
