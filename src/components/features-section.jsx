import { Stethoscope, FlaskConical, Brain, Trophy, CalendarDays, LineChart } from "lucide-react"

const features = [
  {
    icon: Stethoscope,
    color: "bg-pink-50 text-pink-600",
    title: "Real Patient Cases",
    description: "Work through 250+ cases built from real clinical scenarios — history, vitals, physical exam and all.",
  },
  {
    icon: FlaskConical,
    color: "bg-blue-50 text-blue-600",
    title: "Order Diagnostic Tests",
    description: "Choose labs, imaging and more. Learn which tests matter and which ones waste time and money.",
  },
  {
    icon: Brain,
    color: "bg-purple-50 text-purple-600",
    title: "Sharpen Clinical Reasoning",
    description: "Build differential diagnoses under realistic pressure. Get instant feedback on where your thinking went wrong.",
  },
  {
    icon: CalendarDays,
    color: "bg-orange-50 text-orange-600",
    title: "Daily Challenges",
    description: "A fresh case every day keeps your skills sharp. Compete with others on the leaderboard.",
  },
  {
    icon: LineChart,
    color: "bg-green-50 text-green-600",
    title: "Clinical Insights",
    description: "After every case, get a full breakdown — correct diagnosis, key clues, and why other diagnoses didn't fit.",
  },
  {
    icon: Trophy,
    color: "bg-amber-50 text-amber-600",
    title: "Leaderboard & Progress",
    description: "Earn points for accuracy. Track your growth across specialties and see how you rank globally.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-black uppercase tracking-[0.2em] text-pink-500 mb-3">What You Get</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Everything you need to become a better diagnostician
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Built by doctors, for medical students, residents, and anyone who wants to think clinically.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
