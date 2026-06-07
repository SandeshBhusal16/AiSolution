import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Globe,
  Headset,
  Layers,
  LifeBuoy,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/SectionHeading";

const services = [
  {
    icon: Bot,
    title: "AI-Powered Virtual Assistant",
    description:
      "Smart, always-on assistants that answer questions, automate workflows and help your team work faster.",
  },
  {
    icon: Layers,
    title: "Affordable Prototyping",
    description:
      "Turn ideas into working AI prototypes quickly and affordably, so you can validate before you invest.",
  },
  {
    icon: LifeBuoy,
    title: "Software Support & Assistance",
    description:
      "Reliable software assistance and maintenance to keep your AI-powered tools running smoothly.",
  },
  {
    icon: CalendarDays,
    title: "Promotional Events",
    description:
      "Hands-on workshops and demo events that show how AI can transform the way your business works.",
  },
];

const benefits = [
  { icon: Rocket, title: "Faster delivery", text: "Ship AI features in weeks, not months." },
  { icon: Wallet, title: "Affordable", text: "Start-up friendly pricing and prototypes." },
  { icon: Headset, title: "Expert support", text: "Real engineers, ready when you need them." },
  { icon: TrendingUp, title: "Scalable", text: "Solutions that grow with your business." },
  { icon: ShieldCheck, title: "Secure by design", text: "Privacy and security built in from day one." },
  { icon: Globe, title: "Global reach", text: "Serving customers around the world." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="absolute inset-0 bg-hero-grid" aria-hidden />
        <div className="container relative grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-brand-cyan">
              <Sparkles className="h-3.5 w-3.5" /> AI start-up · Sunderland, UK
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Smarter work with{" "}
              <span className="text-gradient">AI-powered</span> solutions
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              AI-Solution helps businesses worldwide work faster and smarter with
              AI virtual assistants, affordable prototyping, software support and
              live promotional events.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gradient" size="lg">
                <Link href="/schedule-demo">
                  Schedule a Demo <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/events">Join Our Events</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          {/* Decorative analytics panel */}
          <div className="relative hidden lg:block">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-300">
                  Engagement overview
                </p>
                <span className="rounded-full bg-brand-gradient px-2.5 py-1 text-xs font-semibold">
                  Live
                </span>
              </div>
              <div className="mt-6 flex items-end gap-3">
                {[40, 68, 52, 84, 60, 92].map((h, i) => (
                  <div key={i} className="flex-1">
                    <div
                      className="rounded-t-lg bg-brand-gradient"
                      style={{ height: `${h}px` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: "Demos", value: "120+" },
                  { label: "Events", value: "30+" },
                  { label: "Clients", value: "85+" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-white/10 bg-navy-800/60 p-3 text-center"
                  >
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company introduction */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="About AI-Solution"
            title="A Sunderland-based AI start-up with global ambitions"
            description="We design practical AI solutions that solve real business problems. From intelligent virtual assistants to affordable prototypes and dependable software support, our mission is to make advanced AI accessible to organisations of every size."
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              "Customer-focused and outcome-driven",
              "Affordable prototyping for fast validation",
              "Trusted software support and expertise",
            ].map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-2xl border bg-card p-5 shadow-card"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm font-medium">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-muted/50">
        <div className="container">
          <SectionHeading
            eyebrow="What we do"
            title="Our AI services"
            description="Everything you need to explore, build and support AI-powered solutions for your business."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.title}
                  className="group p-6 transition-shadow hover:shadow-soft"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-soft">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI-powered virtual assistant feature */}
      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
              AI Virtual Assistant
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              An AI assistant that works around the clock
            </h2>
            <p className="mt-4 text-muted-foreground">
              Automate repetitive tasks, answer customer questions instantly and
              free your team to focus on high-value work. Our virtual assistants
              are tailored to your business and learn from your data.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "24/7 intelligent customer responses",
                "Automated workflows and task handling",
                "Seamless integration with your tools",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="gradient" className="mt-8">
              <Link href="/schedule-demo">
                See it in a demo <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="rounded-3xl border bg-gradient-to-br from-brand-blue/10 via-brand-cyan/10 to-brand-purple/10 p-8">
            <div className="space-y-4">
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-brand-gradient p-4 text-sm text-white shadow-soft">
                How many demos did we book this week?
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm border bg-card p-4 text-sm shadow-card">
                You booked <strong>18 demo requests</strong> this week — up 24%.
                Would you like me to schedule follow-ups?
              </div>
              <div className="ml-auto max-w-[60%] rounded-2xl rounded-tr-sm bg-brand-gradient p-4 text-sm text-white shadow-soft">
                Yes, please!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Affordable prototyping feature */}
      <section className="section bg-muted/50">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 grid grid-cols-2 gap-4 lg:order-1">
            {[
              { step: "01", title: "Discover", text: "Understand your idea and goals." },
              { step: "02", title: "Design", text: "Map the solution and experience." },
              { step: "03", title: "Build", text: "Create a working AI prototype fast." },
              { step: "04", title: "Validate", text: "Test with users and iterate." },
            ].map((s) => (
              <Card key={s.step} className="p-5">
                <span className="text-2xl font-bold text-gradient">{s.step}</span>
                <h4 className="mt-2 font-semibold">{s.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </Card>
            ))}
          </div>
          <div className="order-1 lg:order-2">
            <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
              Affordable Prototyping
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Validate your AI idea without breaking the budget
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our affordable prototyping process helps you move from concept to a
              working prototype quickly. Test assumptions, gather feedback and
              make confident decisions before committing to full development.
            </p>
            <Button asChild variant="gradient" className="mt-8">
              <Link href="/contact">
                Start a prototype <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Promotional events */}
      <section className="section">
        <div className="container">
          <div className="overflow-hidden rounded-3xl bg-navy-900 text-white">
            <div className="relative grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
              <div className="absolute inset-0 bg-hero-grid opacity-80" aria-hidden />
              <div className="relative">
                <span className="inline-block rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-cyan">
                  Promotional Events
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Join our AI events and workshops
                </h2>
                <p className="mt-4 text-slate-300">
                  Experience AI in action. Our promotional events and hands-on
                  workshops show how AI-Solution can help your team work smarter.
                </p>
              </div>
              <div className="relative flex flex-wrap gap-3 md:justify-end">
                <Button asChild variant="gradient" size="lg">
                  <Link href="/events">
                    Browse events <CalendarDays />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section bg-muted/50">
        <div className="container">
          <SectionHeading
            eyebrow="Why AI-Solution"
            title="Benefits our customers love"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="flex items-start gap-4 rounded-2xl border bg-card p-5 shadow-card"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {benefit.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section">
        <div className="container">
          <div className="rounded-3xl border bg-brand-gradient p-10 text-center text-white shadow-soft md:p-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to work smarter with AI?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/90">
              Book a personalised demo, join an upcoming event, or get in touch
              with our team to discuss your project.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-white text-navy-900 hover:bg-white/90"
              >
                <Link href="/schedule-demo">Schedule a Demo</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/events">Join Our Events</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
