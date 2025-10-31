"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

export default function ProfileSection() {
  const { state, updateProfile } = useStore();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(state.profile);

  const handleSave = async () => {
    await updateProfile(formData);
    setEditing(false);
  };

  return (
    <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Profile</h2>
        {!editing ? (
          <button 
            onClick={() => {
              setFormData(state.profile);
              setEditing(true);
            }}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black"
            >
              Save
            </button>
            <button 
              onClick={() => {
                setFormData(state.profile);
                setEditing(false);
              }}
              className="rounded-full border border-zinc-300 px-3 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      {state.loading ? (
        <p className="text-sm text-zinc-500">Loading profile...</p>
      ) : editing ? (
        <div className="grid gap-4 text-sm">
          <div>
            <label className="text-zinc-500">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            />
          </div>
          <div>
            <label className="text-zinc-500">Age</label>
            <input
              type="number"
              value={formData.age || ""}
              onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : null })}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            />
          </div>
          <div>
            <label className="text-zinc-500">Conditions (comma-separated)</label>
            <input
              type="text"
              value={formData.conditions.join(", ")}
              onChange={(e) => setFormData({ ...formData, conditions: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            />
          </div>
          <div>
            <label className="text-zinc-500">Allergies (comma-separated)</label>
            <input
              type="text"
              value={formData.allergies.join(", ")}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            />
          </div>
        </div>
      ) : (
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-zinc-500">Name</dt>
            <dd>{state.profile.name || "Not set"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Age</dt>
            <dd>{state.profile.age || "Not set"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Conditions</dt>
            <dd>{state.profile.conditions.length > 0 ? state.profile.conditions.join(", ") : "None"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Allergies</dt>
            <dd>{state.profile.allergies.length > 0 ? state.profile.allergies.join(", ") : "None"}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}

