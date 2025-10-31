"use client";

import { useStore } from "@/lib/store";
import { useState, useMemo } from "react";

export default function HistoryReport() {
  const { state } = useStore();
  const [filter, setFilter] = useState<"all" | "dosage" | "adherence">("all");

  // Combine dosage changes and format for display
  const historyItems = useMemo(() => {
    const items: Array<{ id: string; date: string; text: string; type: "dosage" | "adherence" }> = [];
    
    // Add dosage changes
    state.dosageChanges.forEach((change) => {
      const date = new Date(change.ts);
      const medication = state.medications.find(m => m.id === change.medId);
      items.push({
        id: change.id,
        date: change.ts,
        text: `${date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} — Dosage changed: ${medication?.name || "Unknown"} ${change.prevDosage} → ${change.newDosage} (${change.changedBy})`,
        type: "dosage"
      });
    });

    // Sort by date (newest first)
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [state.dosageChanges, state.medications]);

  const filteredItems = filter === "all" 
    ? historyItems 
    : historyItems.filter(item => item.type === filter);

  return (
    <section id="history" className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">History & Reports</h2>
        <button className="rounded-full border border-zinc-300 px-3 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900">
          Download PDF
        </button>
      </div>
      <div className="mb-3 flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 text-xs ${filter === "all" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black" : "border border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("dosage")}
          className={`rounded-full px-3 py-1 text-xs ${filter === "dosage" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black" : "border border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"}`}
        >
          Dosage
        </button>
      </div>
      {state.loading ? (
        <p className="text-sm text-zinc-500">Loading history...</p>
      ) : filteredItems.length === 0 ? (
        <p className="text-sm text-zinc-500">No history records yet.</p>
      ) : (
        <ul className="grid gap-2 text-sm">
          {filteredItems.slice(0, 10).map((item) => (
            <li key={item.id} className="rounded-lg border border-zinc-200 p-3 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
              {item.text}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

