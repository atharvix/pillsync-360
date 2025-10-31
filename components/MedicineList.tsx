"use client";

import { useState } from "react";
import DosageChangeModal from "@/components/DosageChangeModal";
import AddMedicationModal from "@/components/AddMedicationModal";
import { useStore } from "@/lib/store";

export default function MedicineList() {
  const { state, updateMedication, addDosageChange, deleteMedication } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeMed, setActiveMed] = useState<{ id: string; name: string; dosage: string } | undefined>(undefined);

  async function handleDosageChange(e: any) {
    const { dosage, reason } = e.detail || {};
    if (!activeMed || !dosage) return;
    
    const prevDosage = activeMed.dosage;
    
    // Update medication dosage
    await updateMedication(activeMed.id, {
      dosage,
      updated: new Date().toLocaleDateString()
    });
    
    // Add dosage change record
    await addDosageChange({
      medId: activeMed.id,
      prevDosage,
      newDosage: dosage,
      reason: reason || "",
      changedBy: "User",
      ts: new Date().toISOString()
    });
    
    setModalOpen(false);
  }

  // Listen for dosage change events
  if (typeof window !== "undefined") {
    window.removeEventListener("dosageChange", handleDosageChange as any);
    window.addEventListener("dosageChange", handleDosageChange as any);
  }

  return (
    <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Medication List</h2>
        <button 
          onClick={() => setAddModalOpen(true)}
          className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black"
        >
          Add
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-zinc-500">
            <tr>
              <th className="px-2 py-2">Medicine</th>
              <th className="px-2 py-2">Dosage</th>
              <th className="px-2 py-2">Frequency</th>
              <th className="px-2 py-2">Start</th>
              <th className="px-2 py-2">End</th>
              <th className="px-2 py-2">Added By</th>
              <th className="px-2 py-2">Last Updated</th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
              {state.loading ? (
                <tr>
                  <td colSpan={8} className="px-2 py-4 text-center text-sm text-zinc-500">
                    Loading medications...
                  </td>
                </tr>
              ) : state.medications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-2 py-4 text-center text-sm text-zinc-500">
                    No medications yet. Click "Add" to add one.
                  </td>
                </tr>
              ) : (
                state.medications.map((m) => (
                  <tr key={m.id} className="border-t border-zinc-200 dark:border-zinc-800">
                    <td className="px-2 py-2 font-medium">{m.name}</td>
                    <td className="px-2 py-2">{m.dosage}</td>
                    <td className="px-2 py-2">{m.frequency}</td>
                    <td className="px-2 py-2">{m.start}</td>
                    <td className="px-2 py-2">{m.end || "—"}</td>
                    <td className="px-2 py-2">{m.addedBy}</td>
                    <td className="px-2 py-2">{m.updated}</td>
                    <td className="px-2 py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { 
                            setActiveMed({ id: m.id, name: m.name, dosage: m.dosage }); 
                            setModalOpen(true); 
                          }} 
                          className="rounded-full border border-zinc-300 px-2 py-1 text-[10px] hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
                        >
                          Edit Dosage
                        </button>
                        <button 
                          onClick={() => deleteMedication(m.id)} 
                          className="rounded-full border border-red-300 px-2 py-1 text-[10px] text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-400/30 dark:bg-amber-950/30 dark:text-amber-200">
        ⚠ Interaction check pending — run after confirming meds.
      </div>
      <DosageChangeModal open={modalOpen} onClose={() => setModalOpen(false)} medName={activeMed?.name} />
      <AddMedicationModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </section>
  );
}

