import type { Metadata } from "next";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { EventRegistrationForm } from "@/components/forms/EventRegistrationForm";
import { FILES, readJsonFile } from "@/lib/json-db";
import { formatDate } from "@/lib/utils";
import type { EventItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Join AI-Solution's promotional events and hands-on AI workshops. Register to secure your place.",
};

// Always read the latest events.json (admins can add events at runtime).
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await readJsonFile<EventItem>(FILES.events);
  const sorted = [...events].sort(
    (a, b) =>
      new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
  );
  const eventTitles = sorted.map((event) => event.title);

  return (
    <>
      <PageHeader
        eyebrow="Promotional Events"
        title="Upcoming AI events & workshops"
        description="See AI in action, meet our team and discover how AI-Solution can help your business. Register below to join."
      />

      <section className="section">
        <div className="container">
          {sorted.length === 0 ? (
            <Card className="mx-auto max-w-xl">
              <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
                  <CalendarDays className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-semibold">No events scheduled yet</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  We&apos;re planning our next promotional events. Please check
                  back soon — new workshops will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((event) => (
                <Card key={event.id} className="flex flex-col overflow-hidden">
                  <div className="relative h-44 w-full overflow-hidden bg-muted">
                    {/* Uploaded image served from /public/uploads */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant="info" className="gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(event.eventDate)}
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </Badge>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold">{event.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Registration */}
      <section className="section bg-muted/50">
        <div className="container grid gap-8 lg:grid-cols-[360px_1fr]">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
              <Ticket className="h-3.5 w-3.5" /> Register
            </span>
            <h2 className="text-3xl font-bold tracking-tight">
              Reserve your place
            </h2>
            <p className="mt-4 text-muted-foreground">
              Choose an event, share your details and we&apos;ll save your spot.
              You&apos;ll receive a confirmation from our team.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Event registration</CardTitle>
            </CardHeader>
            <CardContent>
              {sorted.length === 0 ? (
                <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Registration will open when events are announced.
                </p>
              ) : (
                <EventRegistrationForm events={eventTitles} />
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
