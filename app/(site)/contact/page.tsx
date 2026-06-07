import type { Metadata } from "next";
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with AI-Solution. Submit a general inquiry about our AI virtual assistant, prototyping and software support services.",
};

const contactDetails = [
  { icon: MapPin, label: "Location", value: "Sunderland, United Kingdom" },
  { icon: Mail, label: "Email", value: "hello@aisolution.com" },
  { icon: Phone, label: "Phone", value: "+44 (0)191 000 0000" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Let's talk about your AI project"
        description="Have a question about our services or want to discuss a project? Send us an inquiry and our team will get back to you."
      />

      <section className="section">
        <div className="container grid gap-8 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Send us an inquiry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          <aside className="space-y-6">
            <Card className="bg-muted/40">
              <CardHeader>
                <CardTitle className="text-base">Contact details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactDetails.map((detail) => {
                  const Icon = detail.icon;
                  return (
                    <div key={detail.label} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {detail.label}
                        </p>
                        <p className="text-sm font-medium">{detail.value}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-brand-gradient text-white">
              <CardContent className="p-6">
                <p className="text-sm font-semibold">Looking for a demo?</p>
                <p className="mt-2 text-sm text-white/90">
                  If you already know you&apos;d like to see our product, you can
                  schedule a demo directly from the demo page.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
