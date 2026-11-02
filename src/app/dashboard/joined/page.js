import ProtectedRoute from "@/components/ui/ProtectedRoute";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import JoinedEvents from "@/components/dashboard/JoinedEvents";

export const metadata = { title: "Joined events" };

export default function JoinedEventsPage() {
  return (
    <ProtectedRoute>
      <DashboardHeader
        active="/dashboard/joined"
        eyebrow="Your dashboard"
        title="Joined events"
        description="The drives you signed up for, soonest first. Keep this list handy for the mornings you need to remember where you promised to be."
        action={{ href: "/events", label: "Browse events" }}
      />

      <section className="section">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <JoinedEvents />
        </div>
      </section>
    </ProtectedRoute>
  );
}
