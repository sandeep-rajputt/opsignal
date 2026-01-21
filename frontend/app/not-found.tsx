import Link from "next/link";
import Background from "@/components/shared/Background";

export default function NotFound() {
  return (
    <Background>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-card border border-secondary/20 rounded-full mb-2">
            <span className="text-xs text-secondary">Under Development</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-primary">404</h1>

          <h2 className="text-3xl md:text-4xl font-bold">Page Not Found</h2>

          <p className="text-lg text-secondary max-w-md mx-auto">
            This page doesn&apos;t exist yet or is still under development.
            Building one feature at a time.
          </p>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Background>
  );
}
