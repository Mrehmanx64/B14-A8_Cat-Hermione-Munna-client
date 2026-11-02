"use client";

import { useRouter } from "next/navigation";
import api, { toApiError } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";
import EventForm from "@/components/events/EventForm";

export default function EventCreateForm() {
  const router = useRouter();
  const toast = useToast();

  async function handleCreate(values) {
    try {
      const { data } = await api.post("/api/events", values);
      toast.success("Event published. Neighbours can find it now.");
      // The brief asks for a redirect to the Upcoming Events page after create.
      router.replace("/events");
      router.refresh();
    } catch (error) {
      const { message } = toApiError(error);
      toast.error(message);
    }
  }

  return <EventForm onSubmit={handleCreate} submitLabel="Publish event" pendingLabel="Publishing…" />;
}
