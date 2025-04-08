import { db } from "@/config/firebase";
import { Business } from "@/types/types";
import { doc, getDoc } from "firebase/firestore";

export const getUserById = async (userId: string): Promise<Business> => {
  try {
    const businessRef = doc(db, "users", userId);
    const businessSnap = await getDoc(businessRef);

    if (businessSnap.exists()) {
      return { id: businessSnap.id, ...(businessSnap.data() as Business) };
    } else {
      throw new Error("User business not found");
    }
  } catch (error) {
    console.error("Business info error:", error);
    throw error;
  }
};