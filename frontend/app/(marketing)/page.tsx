import Link from "next/link";
import Image from "next/image";
import LogoSvg from "@/svg/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Clock,
  Users,
  BarChart3,
  Bell,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoSvg height={20} />
          <p className="font-bold text-xl">OPSIGNAL</p>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">
              Get Started
              <ArrowRight className="ml-1" />
            </Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="px-6 pt-20 pb-32 max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="outline" className="gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now in Beta
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              When things break, <span className="text-primary">OpSignal</span>{" "}
              keeps your team in <span className="text-primary">signal.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Incidents don&apos;t wait. Neither should your team. Incident
              management, task tracking, and team collaboration built for
              engineering teams that move fast.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="text-base">
                  Start Free Trial
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>

            <div className="pt-8">
              <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-2xl">
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src="/opsignal-dashboard.png"
                    alt="OpSignal Dashboard Preview"
                    width={1920}
                    height={1080}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-16 border-y border-border/40">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  99.9%
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Uptime SLA
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  &lt;2min
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Avg Response Time
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  24/7
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Monitoring
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  500+
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Teams Trust Us
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="px-6 py-24 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Incidents don&apos;t wait. Neither should your team.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                When production breaks at 3 AM, every second counts. Traditional
                tools are slow, disconnected, and leave your team scrambling.
                OpSignal brings everything together in one place.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Instant notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Get alerted the moment something breaks
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Centralized tracking</div>
                    <div className="text-sm text-muted-foreground">
                      All incidents, tasks, and improvements in one dashboard
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Team collaboration</div>
                    <div className="text-sm text-muted-foreground">
                      Work together seamlessly with role-based access
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-xl border border-border/50 bg-card p-6 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="destructive">Critical</Badge>
                    <span className="text-xs text-muted-foreground">
                      2 min ago
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Database connection timeout
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Production API experiencing high latency
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      3 team members notified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                OpSignal at a glance.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage incidents, track tasks, and keep
                your team in sync.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card rounded-xl border border-border/50 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Incident Tracking
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create, assign, and resolve incidents instantly. Track
                  severity levels, status changes, and maintain complete audit
                  logs.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border/50 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Task Management</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Organize work with priority-based tasks. Track progress, set
                  deadlines, and ensure nothing falls through the cracks.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border/50 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Team Collaboration
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Role-based access control, team workspaces, and instant
                  updates keep everyone on the same page.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border/50 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Smart Notifications
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get notified via email when incidents are created, updated, or
                  resolved. Never miss a critical update.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border/50 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Activity Logs</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Complete audit trail of all changes. Track who did what and
                  when for full transparency and accountability.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border/50 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Enterprise Security
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Bank-level encryption, secure authentication, and granular
                  permissions keep your data safe.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-6 py-24 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for how real teams work.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From incident to resolution in minutes, not hours.
            </p>
          </div>

          <div className="space-y-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="rounded-xl border border-border/50 bg-card p-2 shadow-xl">
                  <div className="rounded-lg overflow-hidden">
                    <Image
                      src="/opsignal-incident.png"
                      alt="OpSignal Incident Management"
                      width={1920}
                      height={1080}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  <Zap className="h-3 w-3" />
                  Incident Management
                </div>
                <h3 className="text-3xl font-bold">Create & track incidents</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Log incidents with severity levels, descriptions, and affected
                  systems. Assign to team members and track status instantly.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  <Users className="h-3 w-3" />
                  Team Collaboration
                </div>
                <h3 className="text-3xl font-bold">Collaborate seamlessly</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Add work logs, update status, and communicate with your team.
                  Everyone stays informed with automatic notifications.
                </p>
              </div>
              <div>
                <div className="rounded-xl border border-border/50 bg-card p-2 shadow-xl">
                  <div className="rounded-lg overflow-hidden">
                    <Image
                      src="/opsignal-logs.png"
                      alt="OpSignal Work Logs"
                      width={1920}
                      height={1080}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Changelog/Activity Section */}
        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Every change. Every action. Every timestamp.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Complete visibility into your team&apos;s work. Track status
                  changes, severity updates, and every action taken on incidents
                  and tasks.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">
                      Full audit trail
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">
                      Timestamp every action
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">
                      Track team accountability
                    </span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Incident resolved</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Database connection restored
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        2 minutes ago
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Team member assigned
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        John assigned to INC-1234
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        5 minutes ago
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                      <Bell className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Severity updated to Critical
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        API response time degraded
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        12 minutes ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-6 py-24 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, transparent pricing.
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free, scale as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="rounded-xl border border-border/50 bg-card p-8 shadow-sm">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Up to 5 team members</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Unlimited incidents & tasks</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Email notifications</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Basic analytics</span>
                </li>
              </ul>
              <Link href="/register" className="block">
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="rounded-xl border-2 border-primary bg-card p-8 shadow-lg relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Unlimited team members</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Everything in Free</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Priority support</span>
                </li>
              </ul>
              <Link href="/register" className="block">
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Your next incident is coming.{" "}
              <span className="text-primary">Be ready.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of engineering teams who trust OpSignal to keep
              their systems running smoothly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="text-base">
                  Start Free Trial
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 mt-5 border-t border-border/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
          <p>© 2024 OpSignal. Built with determination.</p>
          <div>
            <a
              href="https://github.com/sandeep-rajputt/opsignal"
              className="hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
