"use client"

import Image from "@/components/Image"
import { useEffect, useState } from "react"

const screenshots = ["/basic-info.png", "/basic-info1.png", "/basic-info2.png", "/basic-info3.png"]

export function PhoneMockup() {
  const [activeIndex, setActiveIndex] = useState(0)
  const total = screenshots.length

  useEffect(() => {
    if (total <= 1) return

    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total)
    }, 4000)

    return () => window.clearInterval(id)
  }, [total])

  return (
    <div className="relative w-[280px] md:w-[320px] mx-auto">
      {/* Phone frame */}
      <div className="relative bg-foreground rounded-[40px] p-2 shadow-2xl">
        {/* Screen */}
        <div className="relative bg-card rounded-[32px] overflow-hidden">
          {/* Static background image */}
          <div className="absolute inset-0">
            <Image
              src="/basic-info-bg.png"
              alt="Diagnose It app background"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Full-screen app screenshot slider */}
          <div className="relative w-full aspect-[9/19.5] overflow-hidden flex flex-col items-center justify-center">
            <div
              className="flex h-[72%] w-[98%] transition-transform duration-700 ease-in-out mt-21"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {screenshots.map((src, index) => (
                <div key={src} className="relative h-full w-full shrink-0 rounded-[24px] overflow-hidden">
                  <Image
                    src={src}
                    alt="Diagnose It app - Basic Info & Chief Complaint screen"
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {/* Pagination dots + nav buttons (inside phone) */}
            <div className="mt-1 flex w-full flex-col items-center gap-3 pb-3">
              <div className="flex items-center justify-center gap-2">
                {screenshots.map((_, index) => (
                  <span
                    key={index}
                    className={`h-2 w-2 rounded-full ${index === activeIndex ? "bg-primary" : "bg-white/50"
                      }`}
                  />
                ))}
              </div>

              <div className="flex w-full items-center justify-between px-5">
                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => (prev - 1 + total) % total)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 border border-border shadow-md text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Previous screen"
                >
                  <ChevronRightIcon className="h-4 w-4 rotate-180" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => (prev + 1) % total)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 border border-border shadow-md text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Next screen"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground rounded-full" />
      </div>
    </div>
  )
}

function SignalIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <rect x="1" y="14" width="4" height="8" rx="1" />
      <rect x="7" y="10" width="4" height="12" rx="1" />
      <rect x="13" y="6" width="4" height="16" rx="1" />
      <rect x="19" y="2" width="4" height="20" rx="1" />
    </svg>
  )
}

function WifiIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 18c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-5.3-3.7c2.9-2.9 7.7-2.9 10.6 0l1.4-1.4c-3.7-3.7-9.7-3.7-13.4 0l1.4 1.4zm-2.8-2.8c4.5-4.5 11.8-4.5 16.2 0l1.4-1.4c-5.3-5.3-13.8-5.3-19 0l1.4 1.4z" />
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg className="w-6 h-4" viewBox="0 0 28 14" fill="currentColor">
      <rect x="0" y="1" width="24" height="12" rx="3" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="2" y="3" width="18" height="8" rx="1" />
      <rect x="25" y="4" width="2" height="6" rx="1" />
    </svg>
  )
}

function PuzzleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.452-.802-.93V13c0-.551-.448-1-1-1h-2.5c-.552 0-1 .449-1 1s-.448 1 1 1H16v1.5c0 .552.448 1 1 1s1-.448 1-1v-.67c0-.478.332-.86.802-.93a.98.98 0 0 1 .837.276l1.611 1.611c.943.943.943 2.464 0 3.408l-1.568 1.568c-.23.23-.337.556-.289.878.069.47.451.802.93.802H22c.552 0 1-.448 1-1V8c0-.552-.448-1-1-1h-1.631c-.478 0-.86-.332-.93-.802z" />
      <path d="M4.561 16.15c.049-.322-.059-.648-.289-.878L2.704 13.704A2.41 2.41 0 0 1 1.998 12c0-.617.235-1.233.706-1.704l1.611-1.611a.98.98 0 0 1 .837-.276c.47.07.802.452.802.93V11c0 .551.448 1 1 1h2.5c.552 0 1-.449 1-1s-.448-1-1-1H8V8.5c0-.552-.448-1-1-1s-1 .448-1 1v.67c0 .478-.332.86-.802.93a.98.98 0 0 1-.837-.276L2.75 8.213c-.943-.943-.943-2.464 0-3.408l1.568-1.568c.23-.23.337-.556.289-.878C4.538 1.89 4.156 1.558 3.677 1.558H2c-.552 0-1 .448-1 1V16c0 .552.448 1 1 1h1.631c.478 0 .86.332.93.802z" />
    </svg>
  )
}

function ChevronRightIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
