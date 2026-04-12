"use client"

import Image from "@/components/Image"
import { useEffect, useState } from "react"

const screenshots = ["/basic-info.png", "/basic-info1.png", "/basic-info2.png", "/basic-info3.png"]

export function MobileScreensCarousel() {
  const validScreens = screenshots
  const [activeIndex, setActiveIndex] = useState(0)
  const total = validScreens.length

  useEffect(() => {
    if (total <= 1) return

    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total)
    }, 2000)

    return () => window.clearInterval(id)
  }, [total])

  if (total === 0) return null

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="relative h-[520px] w-full rounded-[32px] bg-card shadow-2xl overflow-hidden">
        <Image
          src={validScreens[activeIndex]}
          alt="Diagnose It app screen"
          fill
          className="object-cover"
          priority={activeIndex === 0}
        />
      </div>

      {/* Dots */}
      {total > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {validScreens.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === activeIndex ? "bg-primary" : "bg-muted-foreground/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}


