"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import dotenv from "dotenv";
// import { ILocations } from "@/components/businesses-table";

dotenv.config();

interface User {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface Business {
  user: {
    businessName: string; // ✅ Corregido
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
  login: (formData: User) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // const [businesses, setBusinesses] = useState<Business | null>(null)
  const [user, setUser] = useState<Business | null>(null);
  const router = useRouter();

  const login = async (credentials: User) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
        credentials
      );
      setUser(data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    setUser(null);
    router.push("/login");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
