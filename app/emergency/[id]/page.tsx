"use client";

import { useEffect, useState } from "react";
import { db } from "@/src/firebase";
import { doc, getDoc } from "firebase/firestore";

type Props = { params: { id: string } };

export default function EmergencyView({ params }: Props) {
  const { id } = params;
  const [payload, setPayload] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEmergencyCard() {
      try {
        const docRef = doc(db, "emergencyCards", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPayload(docSnap.data());
        }
      } catch (error) {
        console.error("Failed to load emergency card:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadEmergencyCard();
  }, [id]);

  const expired = payload ? Date.now() > payload.expiresAt : false;
  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-sm text-zinc-500">Loading emergency card...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-2 text-2xl font-semibold">Emergency Summary</h1>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        Link ID: {id} — Read-only view. {expired ? "Expired" : "Valid"}
      </p>
      {!payload ? (
        <div className="rounded-2xl border border-zinc-200 p-5 text-sm text-[color:var(--color-muted)] dark:border-zinc-800">
          No data found for this link.
        </div>
      ) : (
        <section className="grid gap-4">
          <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <h2 className="mb-2 text-lg font-semibold">Patient</h2>
            <p className="text-sm text-[color:var(--color-muted)]">
              {payload.patient?.name || "Unknown"}, {payload.patient?.age || "N/A"} • 
              Conditions: {payload.patient?.conditions?.join(", ") || "None"} • 
              Allergies: {payload.patient?.allergies?.join(", ") || "None"}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <h2 className="mb-2 text-lg font-semibold">Current Medications</h2>
            {payload.medications && payload.medications.length > 0 ? (
              <ul className="grid gap-1 text-sm">
                {payload.medications.map((m: any) => (
                  <li key={m.id}>{m.name} {m.dosage} — {m.frequency || "schedule N/A"}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-500">No medications listed</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

