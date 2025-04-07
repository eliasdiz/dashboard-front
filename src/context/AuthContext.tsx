"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { UserBusiness } from "@/types/types";
import { getUserById } from "@/services/user";
/* import { authenticateAccount } from "@/services/auth"; */
import { toast } from "react-toastify";

export interface AuthContextType {
  currentUser: FirebaseUser | null;
  businessData: UserBusiness | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string, businessData: Partial<UserBusiness>) => Promise<void>;
  signupWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [businessData, setBusinessData] = useState<UserBusiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const businessResponse = await getUserById(user.uid);
          setBusinessData(businessResponse as UserBusiness);
        } catch (err) {
          console.error("Error fetching business data:", err);
        }
      } else {
        setBusinessData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

/*   const handleAuthenticateAccount = async () => {
    const response = await authenticateAccount();
    if (response) {
      window.location.href = response.auth_url;
    }
  } */

  const signup = async (email: string, password: string, businessData: Partial<Business>) => {
    setError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        ...businessData,
        email,
        createdAt: new Date().toISOString(),
        userId: user.uid
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Google login error:", err.message);
        setError(err.message || "Error during Google signup");
      } else {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred during Google signup");
      }
      console.error("Error during signup:", err);
      setError(err.message || "An error occurred during signup");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signupWithGoogle = async () => {
    setError(null);
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user already exists in our database
      const docRef = doc(db, "businesses", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // New user - create business profile
        const displayName = user.displayName || '';
        const nameParts = displayName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        await setDoc(docRef, {
          firstName,
          lastName,
          businessName: `${firstName}'s Business`,
          email: user.email,
          phone: user.phoneNumber || '',
          createdAt: new Date().toISOString(),
          userId: user.uid
        });
      }

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Google signup error:", err);
      setError(err.message || "Error during Google signup");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      /*    handleAuthenticateAccount(); */
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error("Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error("Google login failed");
      console.error("Google login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err: any) {
      console.error("Error signing out:", err);
      setError(err.message || "Error signing out");
      throw err;
    }
  };

  const value = {
    currentUser,
    businessData,
    loading,
    error,
    signup,
    signupWithGoogle,
    login,
    loginWithGoogle,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};