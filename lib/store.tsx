"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { db } from "@/src/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  start: string;
  end?: string;
  addedBy: string;
  updated: string;
  userId: string;
};

export type DosageChange = {
  id: string;
  medId: string;
  prevDosage: string;
  newDosage: string;
  reason: string;
  changedBy: string;
  ts: string;
  userId: string;
};

export type Profile = {
  name: string;
  age: number | null;
  conditions: string[];
  allergies: string[];
};

export type StoreState = {
  profile: Profile;
  medications: Medication[];
  dosageChanges: DosageChange[];
  reminders: Reminder[];
  loading: boolean;
};

const defaultState: StoreState = {
  profile: { name: "", age: null, conditions: [], allergies: [] },
  medications: [],
  dosageChanges: [],
  reminders: [],
  loading: true
};

export type Reminder = {
  id: string;
  medId: string;
  medicineName: string;
  time: string; // "Morning", "Night", "Afternoon", etc.
  frequency: string; // "Daily", "Weekly", etc.
  enabled: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type StoreCtx = {
  state: StoreState;
  setState: React.Dispatch<React.SetStateAction<StoreState>>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  addMedication: (med: Omit<Medication, "id" | "userId">) => Promise<void>;
  updateMedication: (id: string, updates: Partial<Medication>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  addDosageChange: (change: Omit<DosageChange, "id" | "userId">) => Promise<void>;
  addReminder: (reminder: Omit<Reminder, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
};

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<StoreState>(defaultState);

  // Load user profile
  useEffect(() => {
    if (!user || authLoading) {
      setState(defaultState);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Handle both nested profile structure and flat structure
        const profileData = data.profile || data;
        setState((prev) => ({
          ...prev,
          profile: {
            name: profileData.name || "",
            age: profileData.age ?? null,
            conditions: profileData.conditions || [],
            allergies: profileData.allergies || []
          },
          loading: false
        }));
      } else {
        // Create default profile if doesn't exist
        setDoc(doc(db, "users", user.uid), {
          profile: defaultState.profile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    });

    return unsubscribe;
  }, [user, authLoading]);

  // Load medications
  useEffect(() => {
    if (!user || authLoading) {
      return;
    }

    const q = query(
      collection(db, "medications"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const medications = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          updated: data.updatedAt?.toDate?.()?.toLocaleDateString() || data.updated || ""
        } as Medication;
      });
      setState((prev) => ({ ...prev, medications }));
    });

    return unsubscribe;
  }, [user, authLoading]);

  // Load dosage changes
  useEffect(() => {
    if (!user || authLoading) {
      return;
    }

    const q = query(
      collection(db, "dosageChanges"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dosageChanges = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          ts: data.ts || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        } as DosageChange;
      });
      setState((prev) => ({ ...prev, dosageChanges }));
    });

    return unsubscribe;
  }, [user, authLoading]);

  // Load reminders
  useEffect(() => {
    if (!user || authLoading) {
      return;
    }

    const q = query(
      collection(db, "reminders"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reminders = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString()
        } as Reminder;
      });
      setState((prev) => ({ ...prev, reminders }));
    });

    return unsubscribe;
  }, [user, authLoading]);

  const updateProfile = async (profile: Partial<Profile>) => {
    if (!user) {
      throw new Error("User must be authenticated to update profile");
    }
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        profile: {
          ...state.profile,
          ...profile
        },
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  const addMedication = async (med: Omit<Medication, "id" | "userId">) => {
    if (!user) {
      throw new Error("User must be authenticated to add medications");
    }
    try {
      // Use backend API instead of direct Firestore
      const { medicationAPI } = await import('@/lib/apiClient');
      await medicationAPI.create(med);
      // Firestore listener will automatically sync the new medication
    } catch (error) {
      console.error("Failed to add medication:", error);
      throw error;
    }
  };

  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    if (!user) return;
    try {
      // Use backend API instead of direct Firestore
      const { medicationAPI } = await import('@/lib/apiClient');
      await medicationAPI.update(id, updates);
      // Firestore listener will automatically sync the update
    } catch (error) {
      console.error("Failed to update medication:", error);
      throw error;
    }
  };

  const deleteMedication = async (id: string) => {
    if (!user) return;
    try {
      // Use backend API instead of direct Firestore
      const { medicationAPI } = await import('@/lib/apiClient');
      await medicationAPI.delete(id);
      // Firestore listener will automatically sync the deletion
    } catch (error) {
      console.error("Failed to delete medication:", error);
      throw error;
    }
  };

  const addDosageChange = async (change: Omit<DosageChange, "id" | "userId">) => {
    if (!user) return;
    await addDoc(collection(db, "dosageChanges"), {
      ...change,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
  };

  const addReminder = async (reminder: Omit<Reminder, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return;
    await addDoc(collection(db, "reminders"), {
      ...reminder,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  };

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    if (!user) return;
    const reminderRef = doc(db, "reminders", id);
    await updateDoc(reminderRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  };

  const deleteReminder = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "reminders", id));
  };

  const value = useMemo(
    () => ({
      state,
      setState,
      updateProfile,
      addMedication,
      updateMedication,
      deleteMedication,
      addDosageChange,
      addReminder,
      updateReminder,
      deleteReminder
    }),
    [state]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("StoreProvider missing");
  return ctx;
}
