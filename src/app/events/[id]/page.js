import { Suspense } from "react";
import EventDetail, { DetailSkeleton } from "@/components/events/EventDetail";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: "Event details",
    description: `Details and volunteer sign-up for a Shongkolpo community service event (${id}).`,
  };
}

/** Keeps the `params` read inside a Suspense boundary so the App Shell stays URL-independent. */
async function DetailBody({ params }) {
  const { id } = await params;
  return <EventDetail eventId={id} />;
}

export default function EventDetailPage({ params }) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <DetailBody params={params} />
    </Suspense>
  );
}
