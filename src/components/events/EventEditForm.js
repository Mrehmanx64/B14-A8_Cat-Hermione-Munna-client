"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { toApiError } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";
import EventForm from "@/components/events/EventForm";

export default function EventEditForm({ eventId }) {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;

    api
      .get(`/api/events/${eventId}`)
      .then(({ data }) => {
        if (cancelled) return;
        if (!data.isOwner) {
          setError("You can only edit events you created.");
          return;
        }
        setEvent(data);
      })
      .catch((err) => {
        if (!cancelled) setError(toApiError(err).message);
      });

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  async function handleUpdate(values) {
    try {
      await api.patch(`/api/events/${eventId}`, values);
      toast.success("Event updated.");
      router.replace(`/events/${eventId}`);
      router.refresh();
    } catch (err) {
      const { message, errors } = toApiError(err);
      toast.error(Object.values(errors)[0] || message);
    }
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-base-300 bg-base-100 px-6 py-12 text-center">
        <h2 className="font-display text-xl font-semibold">Cannot edit this event</h2>
        <p className="mt-2 text-sm text-base-content/70">{error}</p>
        <Link href="/dashboard/manage" className="btn btn-primary mt-6 rounded-full px-6">
          Back to Manage Events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="grid gap-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="skeleton-tint h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <EventForm
      initialValues={{
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        thumbnail: event.thumbnail,
        location: event.location,
        eventDate: event.eventDate,
      }}
      onSubmit={handleUpdate}
      submitLabel="Save changes"
      pendingLabel="Saving…"
    />
  );
}
