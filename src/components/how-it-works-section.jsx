import { ClipboardList, FlaskConical, Stethoscope, Pill, Lightbulb } from "lucide-react"

const steps = [
  {
    icon: ClipboardList,
    color: "bg-pink-500",
    label: "Step 1",
    title: "Read the Case",
    description: "Review the patient's age, chief complaint, history, vitals, and physical exam findings.",
  },
  {
    icon: FlaskConical,
    color: "bg-blue-500",
    label: "Step 2",
    title: "Order Tests",
    description: "Pick labs and imaging wisely. Points are deducted for unnecessary tests.",
  },
  {
    icon: Stethoscope,
    color: "bg-purple-500",
    label: "Step 3",
    title: "Make Your Diagnosis",
    description: "Choose from a list of differential diagnoses. Only one is correct.",
  },
  {
    icon: Pill,
    color: "bg-orange-500",
    label: "Step 4",
    title: "Prescribe Treatment",
    description: "Select the right medications and interventions for your diagnosis.",
  },
  {
    icon: Lightbulb,
    color: "bg-green-500",
    label: "Step 5",
    title: "Get Clinical Insights",
    description: "See your score, where you went wrong, and the reasoning behind the correct answer.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-black uppercase tracking-[0.2em] text-pink-500 mb-3">The Gameplay Loop</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            How a case works
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Every case mirrors a real clinical encounter — from presentation to final insight.
          </p>
        </div>

        {/* Desktop: horizontal stepper */}
        <div className="hidden md:flex items-start gap-0">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 flex flex-col items-center text-center relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gray-200 z-0" />
              )}
              <div className={`relative z-10 w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center shadow-md mb-4`}>
                <step.icon className="w-5 w-5 text-white h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{step.label}</span>
              <h3 className="text-sm font-bold text-gray-900 mb-1 px-2">{step.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed px-3">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile: vertical list */}
        <div className="md:hidden space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className={`w-11 h-11 rounded-xl ${step.color} flex items-center justify-center shrink-0`}>
                <step.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{step.label}</span>
                <h3 className="text-sm font-bold text-gray-900">{step.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
