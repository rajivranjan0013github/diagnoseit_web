import Image from "@/components/Image"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Internal Medicine Resident",
    image: "/female-doctor-portrait-professional.png",
    quote: "Diagnose It has transformed how I approach clinical cases. The puzzles are challenging yet educational!",
    rating: 5,
  },
  {
    name: "Dr. Michael Torres",
    role: "Medical Student",
    image: "/male-medical-student-portrait-professional.jpg",
    quote: "Perfect for USMLE prep. The cases cover real scenarios you'd see in clinical rotations.",
    rating: 5,
  },
  {
    name: "Dr. Emily Watson",
    role: "Family Medicine",
    image: "/female-physician-portrait-professional-smiling.jpg",
    quote: "I use it during my commute. It keeps my diagnostic skills sharp in a fun, engaging way.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-muted-foreground text-lg">
            Join thousands of doctors and students improving their diagnostic skills
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground mb-6 text-lg leading-relaxed">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
