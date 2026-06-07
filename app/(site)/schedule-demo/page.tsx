import type { Metadata } from "next";
import { CalendarClock, CheckCircle2, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { ScheduleDemoForm } from "@/components/forms/ScheduleDemoForm";

export const metadata: Metadata = {
  title: "Schedule a Demo",
  description:
    "Book a personalised demo of AI-Solution's AI virtual assistant, prototyping and software support services.",
};

const expectations = [
  { icon: Clock, text: "A 30-minute tailored walkthrough" },
  { icon: Users, text: "Meet our AI specialists" },
  { icon: CheckCircle2, text: "Answers to your specific questions" },
];

export default function ScheduleDemoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Schedule a Demo"
        title="Book a personalised AI demo"
        description="Tell us a little about your business and pick a preferred date. Our team will confirm your slot and show how AI-Solution can help you work smarter."
      />

      <section className="section">
        <div className="container grid gap-8 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-primary" />
                Demo request form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScheduleDemoForm />
            </CardContent>
          </Card>

          <aside className="space-y-6">
            <Card className="bg-muted/40">
              <CardHeader>
                <CardTitle className="text-base">What to expect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {expectations.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-brand-gradient text-white">
              <CardContent className="p-6">
                <p className="text-sm font-semibold">Prefer to talk first?</p>
                <p className="mt-2 text-sm text-white/90">
                  Use our contact page to send a general inquiry and a member of
                  the team will get back to you.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
