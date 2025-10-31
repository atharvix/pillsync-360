"use client";

import ProfileSection from "@/components/ProfileSection";
import UploadSection from "@/components/UploadSection";
import MedicineList from "@/components/MedicineList";
import ReminderSection from "@/components/ReminderSection";
import AdherenceTracker from "@/components/AdherenceTracker";
import EmergencyButton from "@/components/EmergencyButton";
import HistoryReport from "@/components/HistoryReport";
import InteractionChecker from "@/components/InteractionChecker";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100dvh-64px)] items-center justify-center">
        <p className="text-sm text-zinc-500">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100dvh-64px)] items-center justify-center">
        <p className="text-sm text-zinc-500">Please log in to access your dashboard.</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 grid gap-6 lg:col-span-2">
          <ProfileSection />
          <UploadSection />
          <MedicineList />
          <InteractionChecker />
          <ReminderSection />
        </div>
        <div className="col-span-1 grid gap-6">
          <AdherenceTracker />
          <HistoryReport />
          <EmergencyButton />
        </div>
      </div>
    </ProtectedRoute>
  );
}

