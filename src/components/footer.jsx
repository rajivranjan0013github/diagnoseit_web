import Image from "@/components/Image"
import { Link } from "react-router-dom"
import { AppStoreButtons } from "./app-store-buttons"

export function Footer() {
  return (
    <footer className="bg-white border-t border-pink-100 mt-auto">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left side - Brand and description */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center border border-pink-50">
                <Image
                  src="/diagnose-it-logo.png"
                  alt="Diagnose It logo"
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                />
              </div>
              <span className="text-2xl font-black text-pink-600 tracking-tight">Diagnose It</span>
            </div>
            <p className="text-gray-700 font-medium mb-10 max-w-md leading-relaxed">
              Master the art of clinical diagnosis! Solve authentic patient scenarios, improve your decision-making, and learn medicine through interactive gameplay.
            </p>
            <div className="space-y-4">
               <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Download current version</p>
               <AppStoreButtons />
            </div>
          </div>

          {/* Right side - Links */}
          <div className="lg:text-right">
            <h3 className="font-black text-gray-900 mb-8 uppercase tracking-widest text-sm">Explore</h3>
            <nav className="flex flex-col gap-5">
              <Link
                to="/play"
                className="text-gray-500 hover:text-pink-600 font-bold transition-colors inline-flex items-center gap-2 lg:justify-end"
              >
                Dashboard
              </Link>
              <Link
                to="/play/clinical-insight"
                className="text-gray-500 hover:text-pink-600 font-bold transition-colors inline-flex items-center gap-2 lg:justify-end"
              >
                Solved Cases
              </Link>
              <Link
                to="/play/leaderboard"
                className="text-gray-500 hover:text-pink-600 font-bold transition-colors inline-flex items-center gap-2 lg:justify-end"
              >
                Leaderboard
              </Link>
              <a
                href="https://thethousandways.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-pink-600 font-bold transition-colors inline-flex items-center gap-2 lg:justify-end"
              >
                Support & Contact
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm font-medium">© 2025 Diagnose It. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="text-gray-400 hover:text-pink-600 text-sm font-medium transition-colors">Terms</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-pink-600 text-sm font-medium transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function ExternalLinkIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  )
}
