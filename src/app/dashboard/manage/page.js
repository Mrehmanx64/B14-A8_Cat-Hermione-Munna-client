import ProtectedRoute from "@/components/ui/ProtectedRoute";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ManageEvents from "@/components/dashboard/ManageEvents";

export const metadata = { title: "Manage events" };

export default function ManageEventsPage() {
  return (
    <ProtectedRoute>
      <DashboardHeader
        active="/dashboard/manage"
        eyebrow="Your dashboard"
        title="Manage events"
        description="Every drive you have organised, newest first. Edit the details or delete an event you no longer plan to run."
        action={{ href: "/events/create", label: "Create event" }}
      />

      <section className="section">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <ManageEvents />
        </div>
      </section>
    </ProtectedRoute>
  );
}
