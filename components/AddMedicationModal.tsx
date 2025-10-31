"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddMedicationModal({ open, onClose }: Props) {
  const { addMedication } = useStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    start: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).replace(" ", " "),
    end: "",
    addedBy: "User"
  });

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addMedication({
        ...formData,
        updated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      });
      // Reset form
      setFormData({
        name: "",
        dosage: "",
        frequency: "",
        start: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).replace(" ", " "),
        end: "",
        addedBy: "User"
      });
      onClose();
    } catch (error) {
      console.error("Failed to add medication:", error);
      alert("Failed to add medication. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <form 
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
      >
        <h3 className="mb-4 text-lg font-semibold">Add Medication</h3>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <label className="text-sm font-medium">Medicine Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Metformin"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Dosage *</label>
            <input
              type="text"
              required
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              placeholder="e.g., 500mg"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Frequency</label>
            <input
              type="text"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              placeholder="e.g., 2/day, Morning, Night"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="text"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                placeholder="e.g., 31 Oct"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium">End Date (optional)</label>
              <input
                type="text"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                placeholder="e.g., 31 Dec"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
              />
            </div>
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Added By</label>
            <select
              value={formData.addedBy}
              onChange={(e) => setFormData({ ...formData, addedBy: e.target.value })}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <option value="User">User</option>
              <option value="Doctor">Doctor</option>
              <option value="Caregiver">Caregiver</option>
              <option value="Upload">Upload</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add Medication"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

