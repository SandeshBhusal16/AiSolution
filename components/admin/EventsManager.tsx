"use client";

import { useState } from "react";
import { CalendarDays, Loader2, MapPin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { EventForm } from "@/components/forms/EventForm";
import { formatDate } from "@/lib/utils";
import type { EventItem } from "@/lib/types";

export function EventsManager({
  initialEvents,
}: {
  initialEvents: EventItem[];
}) {
  const { toast } = useToast();
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  function handleCreated(event: EventItem) {
    setEvents((prev) => [event, ...prev]);
  }

  async function confirmDelete() {
    if (!eventToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/events/${eventToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
        toast({
          variant: "success",
          title: "Event deleted",
          description: "The event has been removed from the public site.",
        });
        setEventToDelete(null);
      } else {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: data.message ?? "Could not delete the event.",
        });
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
      {/* Create form */}
      <Card className="lg:sticky lg:top-20 lg:self-start">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-5 w-5 text-primary" />
            Create promotional event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm onCreated={handleCreated} />
        </CardContent>
      </Card>

      {/* Existing events */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
          {events.length} event{events.length === 1 ? "" : "s"} published
        </h3>

        {events.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
                <CalendarDays className="h-7 w-7" />
              </span>
              <h3 className="text-lg font-semibold">No events yet</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Create your first promotional event using the form. It will
                appear instantly on the public Events page.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((event) => (
              <Card key={event.id} className="flex flex-col overflow-hidden">
                <div className="relative h-36 w-full overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="flex flex-1 flex-col p-4">
                  <h4 className="font-semibold">{event.title}</h4>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(event.eventDate)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.location}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                    {event.description}
                  </p>
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-red-50 hover:text-destructive"
                      onClick={() => setEventToDelete(event)}
                    >
                      <Trash2 /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <Dialog
        open={!!eventToDelete}
        onOpenChange={(open) => !open && setEventToDelete(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this event?</DialogTitle>
            <DialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-foreground">
                {eventToDelete?.title}
              </span>{" "}
              and its image from the public site. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEventToDelete(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="animate-spin" /> Deleting…
                </>
              ) : (
                <>
                  <Trash2 /> Delete event
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
