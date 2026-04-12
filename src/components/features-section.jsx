import { Brain, Target, Trophy, Users } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Real Clinical Cases",
    description: "Practice with authentic patient scenarios based on real medical cases and conditions.",
  },
  {
    icon: Target,
    title: "Diagnostic Thinking",
    description: "Develop systematic approaches to differential diagnosis and clinical reasoning.",
  },
  {
    icon: Trophy,
    title: "Track Progress",
    description: "Monitor your improvement across different specialties and difficulty levels.",
  },
  {
    icon: Users,
    title: "Learn Together",
    description: "Compare your diagnostic approach with peers and learn from detailed explanations.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 text-balance">
            Why <span className="text-primary">Diagnose It</span>?
          </h2>
          <p className="text-muted-foreground text-lg">
            Built by doctors, for doctors. Master clinical diagnosis one puzzle at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-background rounded-2xl p-6 border border-border hover:border-primary/50 transition-colors group"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
