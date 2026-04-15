import { AppStoreButtons } from "./app-store-buttons"

const stats = [
  { value: "250+", label: "Clinical Cases" },
  { value: "10+", label: "Specialties" },
  { value: "Daily", label: "New Challenges" },
  { value: "Free", label: "To Get Started" },
]

const specialties = [
  "Cardiology", "Neurology", "Pulmonology", "Gastroenterology",
  "Endocrinology", "Nephrology", "Hematology", "Rheumatology",
  "Infectious Disease", "Emergency Medicine",
]

const reviews = [
  {
    quote: "Finally an app that feels like real clinical reasoning, not just MCQs.",
    name: "Medical Student, Year 4",
  },
  {
    quote: "The daily challenge keeps me sharp during residency. Love the instant feedback.",
    name: "Internal Medicine Resident",
  },
  {
    quote: "Better than any question bank for building clinical thinking.",
    name: "USMLE Step 2 Candidate",
  },
]

export function TestimonialsSection() {
  return (
    <>
      {/* Stats Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <p className="text-4xl font-black text-pink-500 mb-1">{stat.value}</p>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Pills */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Cases Across Specialties</p>
          <div className="flex flex-wrap justify-center gap-2">
            {specialties.map((s, i) => (
              <span key={i} className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-600 shadow-sm">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-pink-500">What Users Say</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 fill-pink-500" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{r.quote}"</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-pink-500 to-rose-600">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Start diagnosing today
          </h2>
          <p className="text-pink-100 text-lg mb-8 font-medium">
            Free to download. No credit card needed. Jump into your first case in under a minute.
          </p>
          <div className="flex justify-center">
            <AppStoreButtons light />
          </div>
        </div>
      </section>
    </>
  )
}
