export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Choose a Case",
      description: "Select from various medical specialties and difficulty levels.",
    },
    {
      number: "02",
      title: "Gather Clues",
      description: "Review patient history, symptoms, and order relevant tests.",
    },
    {
      number: "03",
      title: "Make Your Diagnosis",
      description: "Apply clinical reasoning to reach your diagnostic conclusion.",
    },
    {
      number: "04",
      title: "Learn & Improve",
      description: "Get detailed feedback and explanations to enhance your skills.",
    },
  ]

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 text-balance">How It Works</h2>
          <p className="text-muted-foreground text-lg">A simple yet powerful way to sharpen your diagnostic skills</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <span className="text-6xl font-extrabold text-primary/20">{step.number}</span>
                <h3 className="text-xl font-bold text-foreground mt-2 mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border -translate-x-1/2">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
