"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface User {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface Business {
  user: {
    businessName: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phone: string;
    token: {
      client_id: string;
      client_secret: string;
      expiry: string;
      refresh_token: string;
      scopes: string[];
      token: string;
      token_uri: string;
      universe_domain: string;
    };
    userId: string;
  };
}

export interface UserContextType {
  user: Business | null;
  setUser: Dispatch<SetStateAction<Business | null>>;
  loading: boolean;
  login: (formData: User) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [user, setUser] = useState<Business | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (credentials: User) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
        credentials
      );
      setUser(data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem(`businesses_${user?.user?.userId}`);
    router.push("/login");
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
