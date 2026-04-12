import { Link } from "react-router-dom"
import Image from "@/components/Image"
import { AppStoreButtons } from "./app-store-buttons"
import { PhoneMockup } from "./phone-mockup"

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#ffe7f0] to-background overflow-hidden">
      {/* Decorative clouds */}
      <div className="absolute top-10 left-10 opacity-60">
        <CloudSVG className="w-24 h-16 text-white" />
      </div>
      <div className="absolute top-20 right-20 opacity-60">
        <CloudSVG className="w-32 h-20 text-white" />
      </div>
      <div className="absolute top-40 left-1/4 opacity-40">
        <CloudSVG className="w-20 h-12 text-white" />
      </div>

      {/* Radial light rays background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] opacity-20">
          <svg viewBox="0 0 800 800" className="w-full h-full">
            {[...Array(12)].map((_, i) => (
              <path key={i} d="M400,400 L400,0 L450,0 Z" fill="#FFC0CB" transform={`rotate(${i * 30} 400 400)`} />
            ))}
          </svg>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-5 lg:pt-12 pb-0">
        {/* Logo and brand + Play Button */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16">
              {/* Logo image */}
              <Image
                src="/diagnose-it-logo.png"
                alt="Diagnose It logo"
                fill
                className="object-contain rounded-xl sm:rounded-2xl"
                priority
              />
              {/* Border overlaid directly on top of the image */}
              <div className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl border border-border shadow-lg" />
            </div>
            <div className="block">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-primary/80 mb-0 sm:mb-1">
                Interactive Clinical Puzzles
              </p>
              <h2 className="text-lg sm:text-2xl font-extrabold text-primary leading-tight">Diagnose It</h2>
            </div>
          </div>

          <Link
            to="/play"
            className="group relative flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-1.5 sm:px-6 sm:py-2.5 text-sm sm:text-base font-bold text-white shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5"
          >
            Try on Web
          </Link>
        </div>

        <div className="flex flex-col items-center gap-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Text + CTA */}
          <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-4 text-balance">
              The game that trains you to{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">Diagnose Better</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-secondary/60 -z-0 rounded-full" />
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium mb-6">
              Solve realistic clinical cases from first symptom to final treatment. Build real-world confidence, one
              puzzle at a time.
            </p>

            {/* App Store Buttons */}
            <div className="flex justify-center lg:justify-start">
              <AppStoreButtons />
            </div>

            <p className="mt-4 text-xs md:text-sm text-muted-foreground">
              Available now on Google Play. Designed for medical students, residents, and anyone who loves medical
              mysteries.
            </p>
          </div>

          {/* Phone Mockup with rotating screenshots */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-primary/10 blur-3xl" />
              <PhoneMockup />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave/hills decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 200" className="w-full h-auto" preserveAspectRatio="none">
          <path
            fill="#FF407D"
            fillOpacity="0.3"
            d="M0,160L48,144C96,128,192,96,288,90.7C384,85,480,107,576,128C672,149,768,171,864,165.3C960,160,1056,128,1152,112C1248,96,1344,96,1392,96L1440,96L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z"
          />
          <path
            fill="#FFC0CB"
            fillOpacity="0.6"
            d="M0,192L48,176C96,160,192,128,288,122.7C384,117,480,139,576,154.7C672,171,768,181,864,170.7C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z"
          />
        </svg>
      </div>
    </section>
  )
}

function CloudSVG({ className }) {
  return (
    <svg viewBox="0 0 100 60" className={className} fill="currentColor">
      <ellipse cx="30" cy="40" rx="25" ry="18" />
      <ellipse cx="55" cy="35" rx="22" ry="20" />
      <ellipse cx="75" cy="42" rx="20" ry="15" />
      <ellipse cx="45" cy="45" rx="30" ry="15" />
    </svg>
  )
}
