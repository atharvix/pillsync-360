"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { db } from "@/src/firebase";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

export default function AdherenceTracker() {
  const { state } = useStore();
  const { user } = useAuth();
  const [adherenceRecords, setAdherenceRecords] = useState<Record<string, boolean>>({});
  const [adherence, setAdherence] = useState(0);

  // Load today's adherence records
  useEffect(() => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, "adherence"),
      where("userId", "==", user.uid),
      where("date", "==", today)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records: Record<string, boolean> = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const key = `${data.medId}:${data.time}`;
        records[key] = data.taken;
      });
      setAdherenceRecords(records);
      
      // Calculate adherence percentage (simplified - this week)
      const total = Object.keys(records).length;
      const taken = Object.values(records).filter(Boolean).length;
      setAdherence(total > 0 ? Math.round((taken / total) * 100) : 0);
    });

    return unsubscribe;
  }, [user]);

  const toggleAdherence = async (medId: string, time: string, taken: boolean) => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    await addDoc(collection(db, "adherence"), {
      userId: user.uid,
      medId,
      date: today,
      time,
      taken,
      createdAt: serverTimestamp()
    });
  };

  // Generate today's schedule from medications
  const todaysSchedule = state.medications.flatMap(m => {
    if (!m.frequency) return [];
    // Simple parsing - could be enhanced
    const times = m.frequency.toLowerCase().includes("morning") ? ["Morning"] : [];
    if (m.frequency.toLowerCase().includes("night")) times.push("Night");
    if (times.length === 0) times.push("Daily");
    
    return times.map(time => ({
      key: `${m.id}:${time}`,
      medicine: m.name,
      time,
      medId: m.id
    }));
  });

  return (
    <section id="caregiver" className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Adherence</h2>
        <span className="text-xs text-zinc-500">Today: {adherence}%</span>
      </div>
      {todaysSchedule.length === 0 ? (
        <p className="text-sm text-zinc-500">No medications scheduled for today.</p>
      ) : (
        <div className="grid gap-2 text-sm">
          {todaysSchedule.map((item) => (
            <div key={item.key} className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
              <span>{item.medicine} — {item.time}</span>
              <label className="inline-flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={adherenceRecords[item.key] || false}
                  onChange={(e) => toggleAdherence(item.medId, item.time, e.target.checked)}
                  className="h-4 w-4"
                />{" "}
                Taken
              </label>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

