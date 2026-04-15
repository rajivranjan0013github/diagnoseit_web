import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Crown,
    Check,
    Minus,
    ArrowRight,
    Star,
    ShieldCheck,
    Infinity,
    MonitorSmartphone
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { AppStoreButtons } from '@/components/app-store-buttons';

export default function PremiumPage() {
    const navigate = useNavigate();
    const { userData, isPremium } = useAppSelector((state) => state.user);

    const features = useMemo(() => [
        { label: 'Access 250+ Full Cases', free: false, pro: true },
        { label: 'Daily Challenges', free: false, pro: true },
        { label: 'Full Clinical Insights', free: false, pro: true },
        { label: 'Access 1000+ real images based diagnotics challenges (Available on app only)', free: false, pro: true },
    ], []);

    const premiumPlan = userData?.premiumPlan || null;
    const premiumExpiresAt = userData?.premiumExpiresAt || null;

    const planLabel = useMemo(() => {
        if (!premiumPlan) return 'Active Subscription';
        const lower = String(premiumPlan).toLowerCase();
        if (lower.includes('life')) return 'Lifetime access';
        if (lower.includes('year') || lower.includes('annual')) return 'Annual Plan';
        if (lower.includes('month')) return 'Monthly Plan';
        if (lower.includes('week')) return 'Weekly Plan';
        return 'Premium Access';
    }, [premiumPlan]);

    const expiryLabel = useMemo(() => {
        if (!premiumExpiresAt) return 'Never expires ✨';
        try {
            const d = new Date(premiumExpiresAt);
            return `Valid until ${d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`;
        } catch {
            return 'Active';
        }
    }, [premiumExpiresAt]);

    return (
        <div className="max-w-3xl mx-auto pb-20 px-4 pt-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full bg-white hover:bg-gray-100 transition shadow-sm border border-gray-100"
                >
                    <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>
                <h1 className="text-2xl font-black text-gray-800 tracking-tight">Premium</h1>
            </div>

            {/* Hero Section */}
            <div className="relative rounded-[3rem] bg-gradient-to-b from-rose-50 to-white p-12 border border-rose-100 shadow-sm mb-10 overflow-hidden text-center">
                {/* Decorative background elements */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-100/50 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl" />
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-rose-100 shadow-sm mb-6">
                        <Crown className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">Diagnose It Pro</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tighter bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent max-w-lg">
                        Unlock Your Full Medical Potential
                    </h2>
                    <p className="text-gray-500 font-bold max-w-md leading-relaxed">
                        Join thousands of medical students and professionals mastering diagnosis through realistic clinical puzzles.
                    </p>
                </div>
            </div>

            {/* Current Status */}
            {isPremium && (
                <div className="bg-white rounded-3xl border-2 border-pink-100 p-6 mb-10 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                            <p className="text-lg font-black text-gray-900 leading-tight">{planLabel}</p>
                            <p className="text-sm text-gray-500 font-bold mt-0.5">{expiryLabel}</p>
                        </div>
                    </div>
                    <div className="bg-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase">Active</div>
                </div>
            )}

            {/* Unified Content Card */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-12">
                {/* Feature Comparison Section */}
                <div className="p-8 pb-4">
                    <div className="bg-gray-50/50 rounded-[2rem] border border-gray-100 overflow-hidden">
                        <div className="grid grid-cols-4 bg-gray-100/30 py-4 px-6 border-b border-gray-100">
                            <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Plan Features</div>
                            <div className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Free</div>
                            <div className="text-center text-[10px] font-black text-pink-500 uppercase tracking-widest">PRO</div>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {features.map((f, idx) => (
                                <div key={idx} className="grid grid-cols-4 items-center py-4 px-6 hover:bg-gray-50 transition-colors">
                                    <div className="col-span-2 text-sm font-bold text-gray-700">{f.label}</div>
                                    <div className="flex justify-center">
                                        {f.free ? <Check className="h-5 w-5 text-green-500 stroke-[3px]" /> : <Minus className="h-4 w-4 text-gray-200" />}
                                    </div>
                                    <div className="flex justify-center">
                                        {f.pro ? <Check className="h-5 w-5 text-pink-500 stroke-[3px]" /> : <Minus className="h-4 w-4 text-gray-200" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>



                {/* Redirect Section (Integrated at bottom of card) */}
                {!isPremium && (
                    <div className="bg-gray-50/80 p-8 text-center border-t border-gray-100">
                        <div className="max-w-md mx-auto">
                            {/* Cross-Platform Note */}
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 flex items-start gap-4 text-left">
                                <div className="bg-blue-100 p-2 rounded-xl shrink-0">
                                    <MonitorSmartphone className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900 text-sm mb-0.5">Cross-Platform Access</h4>
                                    <p className="text-xs text-blue-700 leading-relaxed font-medium">
                                        Subscribe once on mobile and enjoy Pro features everywhere—including right here on the web. Just log in with the same account!
                                    </p>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-gray-900 mb-2">Subscribe on Mobile</h3>
                            <p className="text-sm text-gray-600 font-bold mb-6 leading-relaxed text-center">
                                We currently process payments exclusively through the App Store and Play Store. Download the app to upgrade your account.
                            </p>

                            <div className="flex justify-center flex-wrap gap-4">
                                <AppStoreButtons />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Global Footer (outside card) */}
            <div className="mt-8 text-center px-4">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    Secure Payments via Play Store & App Store
                </p>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed max-w-sm mx-auto">
                    By subscribing via the mobile app, you agree to our Terms of Service and Privacy Policy. Your subscription will be managed by your respective App Store account.
                </p>
            </div>
        </div>
    );
}
