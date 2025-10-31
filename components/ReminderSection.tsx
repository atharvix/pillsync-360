"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

export default function ReminderSection() {
  const { state, addReminder, deleteReminder, updateReminder } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    medId: "",
    time: "Morning",
    frequency: "Daily"
  });

  const handleAddReminder = async () => {
    const medication = state.medications.find(m => m.id === formData.medId);
    if (!medication) {
      alert("Please select a medication");
      return;
    }

    await addReminder({
      medId: formData.medId,
      medicineName: medication.name,
      time: formData.time,
      frequency: formData.frequency,
      enabled: true
    });

    setFormData({ medId: "", time: "Morning", frequency: "Daily" });
    setShowAddForm(false);
  };

  const toggleReminder = async (id: string, enabled: boolean) => {
    await updateReminder(id, { enabled: !enabled });
  };

  return (
    <section id="reminders" className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Reminders</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black"
        >
          {showAddForm ? "Cancel" : "Add Schedule"}
        </button>
      </div>
      
      {showAddForm && (
        <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="grid gap-2 text-sm">
            <div>
              <label className="text-xs font-medium">Medication</label>
              <select
                value={formData.medId}
                onChange={(e) => setFormData({ ...formData, medId: e.target.value })}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <option value="">Select medication</option>
                {state.medications.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium">Time</label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Night">Night</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleAddReminder}
              disabled={!formData.medId}
              className="mt-2 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-black"
            >
              Add Reminder
            </button>
          </div>
        </div>
      )}

      {state.loading ? (
        <p className="text-sm text-zinc-500">Loading reminders...</p>
      ) : state.reminders.length === 0 ? (
        <p className="text-sm text-zinc-500">No reminders set. Click "Add Schedule" to create one.</p>
      ) : (
        <ul className="grid gap-2 text-sm">
          {state.reminders.map((r) => (
            <li key={r.id} className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={r.enabled}
                  onChange={() => toggleReminder(r.id, r.enabled)}
                  className="h-4 w-4"
                />
                <span className={r.enabled ? "" : "text-zinc-400 line-through"}>
                  {r.medicineName} — {r.time} ({r.frequency})
                </span>
              </div>
              <button
                onClick={() => deleteReminder(r.id)}
                className="text-xs text-red-600 hover:text-red-800 dark:text-red-400"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

