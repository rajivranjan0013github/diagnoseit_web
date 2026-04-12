export default function FAQPage() {
    const faqs = [
        {
            question: "What is Diagnose It?",
            answer:
                "Diagnose It is a gamified learning app where you solve realistic clinical cases to practice diagnostic reasoning in a low‑stakes environment.",
        },
        {
            question: "Who is Diagnose It for?",
            answer:
                "The app is designed for medical students, residents, and practicing clinicians who want to sharpen their diagnostic and decision‑making skills.",
        },
        {
            question: "How do the cases work?",
            answer:
                "Each case walks you through basic info, history, exam findings, and investigations. You build a differential, choose next steps, and arrive at a final diagnosis with detailed explanations.",
        },
        {
            question: "Is Diagnose It free to use?",
            answer:
                "We plan to offer a free tier with a curated set of cases and an optional premium subscription that unlocks more specialties, difficulty levels, and analytics.",
        },
        {
            question: "Will my progress sync across devices?",
            answer:
                "Yes. When you sign in with your account, your progress and performance data are securely synced so you can continue learning on any device.",
        },
    ]

    return (
        <main className="min-h-screen bg-background text-foreground">
            <section className="container mx-auto px-4 py-16 max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-balance">
                    Frequently Asked <span className="text-primary">Questions</span>
                </h1>
                <p className="text-muted-foreground mb-10">
                    Learn more about how Diagnose It works and how it can support your clinical training.
                </p>

                <div className="space-y-4">
                    {faqs.map((item, index) => (
                        <details
                            key={item.question}
                            className="group rounded-2xl border border-border bg-card px-5 py-4 open:border-primary/60 open:shadow-md transition-colors"
                            defaultOpen={index === 0}
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                                <span className="font-semibold text-base md:text-lg">{item.question}</span>
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-primary text-sm font-bold">
                                    +
                                </span>
                            </summary>
                            <div className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                                {item.answer}
                            </div>
                        </details>
                    ))}
                </div>
            </section>
        </main>
    )
}
