import Link from "next/link";
import LogoSvg from "@/svg/Logo";

export default function Home() {
  return (
    <div className="min-h-screen ">
      <header className="px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoSvg height={20} />
          <p className="font-bold  text-xl">OPSIGNAL</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-secondary hover:textforeground transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Register
          </Link>
        </div>
      </header>

      <main
        className="px-6 mt-10 flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 180px)" }}
      >
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-card border border-secondary/20 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs text-secondary">In Development</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Infrastructure Monitoring
            <br />
            <span className="text-primary">Made Simple</span>
          </h1>

          <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto">
            Real-time monitoring and alerting platform for your infrastructure.
            Track uptime, performance metrics, and get instant notifications
            when things go wrong.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
            <div className="bg-card border border-secondary/10 rounded-lg p-5">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Real-time Alerts</h3>
              <p className="text-sm text-secondary">
                Get notified instantly via email
              </p>
            </div>

            <div className="bg-card border border-secondary/10 rounded-lg p-5">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Performance Metrics</h3>
              <p className="text-sm text-secondary">
                Track response times and uptime
              </p>
            </div>

            <div className="bg-card border border-secondary/10 rounded-lg p-5">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold mb-1">Secure & Reliable</h3>
              <p className="text-sm text-secondary">
                Enterprise-grade infrastructure
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 mt-5 border-t border-secondary/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-tertiary">
          <p>Built with determination</p>
          <div>
            <Link
              href="https://github.com/sandeep-rajputt/opsignal"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
