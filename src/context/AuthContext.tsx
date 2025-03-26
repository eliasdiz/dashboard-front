"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface User {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthContextType {
  user: {
    user: {
      businessNamestring: string;
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
  } | null;
  login: (formData: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
