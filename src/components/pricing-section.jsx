import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Crown,
  Infinity as InfinityIcon,
  Laptop,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { AppStoreButtons } from '@/components/app-store-buttons';

const plans = [
  {
    name: 'Weekly',
    price: '$5',
    period: 'per week',
    description: 'A flexible plan for focused practice and exam prep.',
    cta: 'Get weekly access',
    featured: false,
  },
  {
    name: 'Lifetime',
    price: '$15',
    period: 'one-time',
    description: 'Pay once and keep learning for as long as you like.',
    cta: 'Unlock for life',
    featured: true,
  },
];

const benefits = [
  { icon: <InfinityIcon className="h-3.5 w-3.5" />, text: 'Play unlimited clinical cases' },
  { icon: <Laptop className="h-3.5 w-3.5" />, text: 'Play here on the web and in the app' },
  { icon: <Stethoscope className="h-3.5 w-3.5" />, text: 'Full diagnostic and treatment challenges' },
  { icon: <Sparkles className="h-3.5 w-3.5" />, text: 'New cases and challenges as they arrive' },
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-[#fff9fb] px-4 pb-20 pt-16 text-gray-900 sm:px-6 sm:pt-20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-52 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-pink-600 shadow-sm">
            <Crown className="h-4 w-4 fill-amber-400 text-amber-500" />
            Diagnose It Pro
          </div>
          <h2 className="text-balance text-4xl font-black leading-[1.08] tracking-tight text-gray-950 sm:text-6xl">
            Unlimited cases.{' '}
            <span className="text-pink-600">One simple choice.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-relaxed text-gray-500 sm:text-lg">
            Practice without limits on the web or in the app. Choose a week of full access, or unlock Diagnose It for life.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2 md:items-stretch">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-[2rem] border p-7 shadow-xl sm:p-9 ${
                plan.featured
                  ? 'border-pink-400 bg-gradient-to-b from-pink-500 to-rose-500 text-white shadow-pink-200/70'
                  : 'border-pink-100 bg-white shadow-gray-200/50'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 right-7 rounded-full bg-gray-950 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-lg">
                  Best value
                </div>
              )}

              <p className={`text-sm font-black uppercase tracking-[0.16em] ${plan.featured ? 'text-pink-100' : 'text-pink-600'}`}>
                {plan.name}
              </p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-6xl font-black tracking-tight">{plan.price}</span>
                <span className={`pb-2 text-sm font-bold ${plan.featured ? 'text-pink-100' : 'text-gray-500'}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`mt-4 min-h-12 font-semibold leading-relaxed ${plan.featured ? 'text-pink-50' : 'text-gray-500'}`}>
                {plan.description}
              </p>

              <div className={`my-7 h-px ${plan.featured ? 'bg-white/20' : 'bg-gray-100'}`} />

              <ul className="flex-1 space-y-4">
                {benefits.map(({ icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm font-bold">
                    <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${plan.featured ? 'bg-white/20' : 'bg-pink-50'}`}>
                      <span className={plan.featured ? 'text-white' : 'text-pink-600'}>{icon}</span>
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#download"
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-black transition hover:-translate-y-0.5 ${
                  plan.featured
                    ? 'bg-white text-pink-600 shadow-lg hover:bg-pink-50'
                    : 'bg-gray-950 text-white shadow-lg hover:bg-gray-800'
                }`}
              >
                {plan.cta} <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>

        <div id="download" className="mx-auto mt-12 max-w-4xl rounded-[2rem] border border-pink-100 bg-white p-7 text-center shadow-lg shadow-pink-100/40 sm:p-10">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-pink-50">
            <ShieldCheck className="h-6 w-6 text-pink-600" />
          </div>
          <h3 className="text-2xl font-black tracking-tight">Choose your plan in the app</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-relaxed text-gray-500">
            Subscribe securely through the App Store or Google Play, then sign in with the same account to play unlimited cases right here on the web.
          </p>
          <div className="mt-6 flex justify-center">
            <AppStoreButtons />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-bold text-gray-500">
          <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-600" /> Secure store payment</span>
          <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-600" /> One account on every device</span>
          <Link to="/terms" className="transition hover:text-pink-600">Terms</Link>
          <Link to="/privacy" className="transition hover:text-pink-600">Privacy</Link>
          <Link to="/refund" className="transition hover:text-pink-600">Refund Policy</Link>
        </div>
      </div>
    </section>
  );
}
