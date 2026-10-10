import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Image from '@/components/Image';
import { PricingSection } from '@/components/pricing-section';

export { PricingSection };

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#fff9fb] text-gray-900">
      <header className="border-b border-pink-100 bg-white/85 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3" aria-label="Diagnose It home">
            <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-pink-100 bg-white shadow-sm">
              <Image src="/diagnose-it-logo.webp" alt="" fill className="object-contain" />
            </div>
            <div>
              <p className="text-lg font-black leading-none text-pink-600">Diagnose It</p>
              <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-gray-500">Clinical puzzles</p>
            </div>
          </Link>

          <Link
            to="/play"
            className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-extrabold text-pink-600 transition hover:border-pink-300 hover:bg-pink-50"
          >
            Play now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <PricingSection />
    </main>
  );
}
