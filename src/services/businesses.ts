// services/businessService.js
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Business } from "@/types/types";

export const getBusinesses = async (): Promise<Business[]> => {
  try {
    const businessesCollection = collection(db, "businesses");
    const businessesSnapshot = await getDocs(businessesCollection);
    const businessList = businessesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Business),
    }));
    return businessList;
  } catch (error) {
    console.error("Error al obtener negocios:", error);
    throw error;
  }
};

export const getBusinessById = async (businessId: string): Promise<Business> => {
  try {
    const businessRef = doc(db, "businesses", businessId);
    const businessSnap = await getDoc(businessRef);

    if (businessSnap.exists()) {
      return { id: businessSnap.id, ...(businessSnap.data() as Business) };
    } else {
      throw new Error("Negocio no encontrado");
    }
  } catch (error) {
    console.error("Error al obtener negocio:", error);
    throw error;
  }
};