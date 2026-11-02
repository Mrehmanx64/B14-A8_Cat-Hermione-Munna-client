import ProtectedRoute from "@/components/ui/ProtectedRoute";
import ProfileEditor from "@/components/profile/ProfileEditor";

export const metadata = { title: "My profile" };

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <section className="wash border-b border-base-300">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <span className="eyebrow">Your account</span>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">My profile</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-base-content/75">
            Keep your name and photo current so organisers recognise you in the
            volunteer list.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProfileEditor />
        </div>
      </section>
    </ProtectedRoute>
  );
}
