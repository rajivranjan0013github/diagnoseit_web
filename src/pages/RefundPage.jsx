import { Link } from 'react-router-dom';
import { ArrowLeft, Ban, Mail } from 'lucide-react';

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:py-16">
      <section className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-xl shadow-pink-100/30 sm:p-10">
          <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-pink-50">
            <Ban className="h-7 w-7 text-primary" />
          </div>

          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-primary">
            Diagnose It
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Refund <span className="text-primary">Policy</span>
          </h1>
          <p className="mt-3 text-sm italic text-muted-foreground">
            <span className="font-semibold">Effective date:</span> July 31, 2026
          </p>

          <div className="mt-8 space-y-8 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold sm:text-2xl">No refunds</h2>
              <p className="mt-3 text-muted-foreground">
                All purchases and subscription payments for Diagnose It are final. We do not offer refunds for any purchase, subscription, renewal, unused time, or partially used service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold sm:text-2xl">Subscriptions</h2>
              <p className="mt-3 text-muted-foreground">
                You may cancel a subscription at any time to prevent future renewal charges. Cancellation does not provide a refund for charges already paid, and access will continue until the end of the current billing period.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold sm:text-2xl">App store purchases</h2>
              <p className="mt-3 text-muted-foreground">
                Purchases made through the Apple App Store or Google Play are processed by the respective store and remain subject to that store's terms and any rights required by applicable law.
              </p>
            </section>

            <section className="rounded-3xl border border-pink-100 bg-pink-50/60 p-6">
              <h2 className="text-xl font-bold">Billing questions</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                If you believe you were charged in error, contact Thousand Ways Private Limited with your purchase details.
              </p>
              <a
                href="mailto:admin@thethousandways.com"
                className="mt-4 inline-flex items-center gap-2 font-bold text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                admin@thethousandways.com
              </a>
            </section>
          </div>
        </div>

        <p className="mt-8 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground italic">
          &copy; 2026 Thousand Ways Private Limited. All Rights Reserved.
        </p>
      </section>
    </main>
  );
}
