'use client';

import { useCallback, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ClipboardCheck,
    Star,
    Crown,
    Gift,
    Shield,
    FileText,
    LogOut,
    ChevronRight,
    Pencil,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearUser } from '@/store/slices/userSlice';

export default function AccountPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { userData, isPremium } = useAppSelector((state) => state.user);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Get user details
    const userName = userData?.displayName || userData?.name || 'User';
    const userEmail = userData?.email || '';
    const userInitial = userName[0]?.toUpperCase() || userEmail[0]?.toUpperCase() || 'U';

    // Calculate stats
    const casesSolved = (userData?.completedCases?.length || 0) + (userData?.completedDailyChallenges?.length || 0);
    const totalPoints = Math.round(userData?.cumulativePoints?.total ?? (typeof userData?.cumulativePoints === 'number' ? userData.cumulativePoints : 0));

    // Referral code
    const referralCode = userData?.referralCode || '';

    // Premium Plan details
    const premiumPlan = userData?.premiumPlan || null;
    const premiumExpiresAt = userData?.premiumExpiresAt || null;

    const planLabel = useMemo(() => {
        if (!premiumPlan) return 'Active subscription';
        const lower = String(premiumPlan).toLowerCase();
        if (lower.includes('life')) return 'Lifetime Plan';
        if (lower.includes('year') || lower.includes('annual')) return 'Annual Plan';
        if (lower.includes('month')) return 'Monthly Plan';
        if (lower.includes('week')) return 'Weekly Plan';
        return 'Active subscription';
    }, [premiumPlan]);

    const expiryLabel = useMemo(() => {
        if (!premiumPlan) return 'Active';
        if (String(premiumPlan).toLowerCase().includes('life')) return 'Never expires ✨';
        if (!premiumExpiresAt) return 'Active';
        try {
            const d = new Date(premiumExpiresAt);
            return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        } catch {
            return 'Active';
        }
    }, [premiumPlan, premiumExpiresAt]);

    // Share with friend
    const handleShareWithFriend = useCallback(async () => {
        const shareMessage = referralCode
            ? `🩺 Learning medicine the real way!
Diagnose It lets you treat patients step-by-step like real OPD cases.
Use my referral code ${referralCode} while signing up ❤️
Join me 👉 https://diagnoseit.in`
            : '🎯 Hey! I\'m solving real clinical cases with Diagnose It! Join here: https://diagnoseit.in';

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Invite to Diagnose It',
                    text: shareMessage,
                    url: 'https://diagnoseit.in',
                });
            } else {
                await navigator.clipboard.writeText(shareMessage);
                alert('Share message copied to clipboard!');
            }
        } catch (error) { }
    }, [referralCode]);

    // Handle logout
    const handleLogout = useCallback(() => {
        dispatch(clearUser());
        window.location.href = '/';
    }, [dispatch]);

    return (
        <div className="max-w-2xl mx-auto space-y-6 px-4 pb-12">
            {/* Profile Section */}
            <div className="flex flex-col items-center pt-6 pb-4">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center mb-3 shadow-sm border-4 border-white">
                    <span className="text-4xl font-extrabold text-pink-600">
                        {userInitial}
                    </span>
                </div>

                {/* Name with Edit Button */}
                <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">{userName}</h1>
                    <button
                        className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition shadow-sm"
                        onClick={() => navigate('/play/account/edit')}
                    >
                        <Pencil className="w-4 h-4 text-pink-600" />
                    </button>
                </div>

                {/* Email */}
                {userEmail && (
                    <p className="text-sm text-gray-500 font-medium">{userEmail}</p>
                )}

                {/* Stats Section */}
                <div className="flex gap-4 mt-6 w-full max-w-md">
                    <Link
                        to="/play/clinical-insight"
                        className="flex-1 flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-110 transition">
                            <ClipboardCheck className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xl font-black text-gray-900 leading-none">{casesSolved}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Cases Solved</p>
                        </div>
                    </Link>

                    <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        </div>
                        <div>
                            <p className="text-xl font-black text-gray-900 leading-none">{totalPoints}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Total Points</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Status Card */}
            {isPremium ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                        <Crown className="w-20 h-20 text-pink-600" />
                    </div>
                    <div className="flex items-center gap-2 mb-3 relative">
                        <Crown className="w-5 h-5 text-pink-600" />
                        <h2 className="text-lg font-black text-gray-900">You're Premium</h2>
                    </div>
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed relative">
                        Thanks for subscribing! You now have unlimited access to all features and clinical cases.
                    </p>
                    <div className="flex justify-between border-t border-gray-50 pt-4 relative">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Plan</p>
                            <p className="text-sm font-black text-gray-900 mt-1">{planLabel}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">
                                {expiryLabel.includes('Never') ? 'Status' : 'Expires At'}
                            </p>
                            <p className="text-sm font-black text-gray-900 mt-1">{expiryLabel}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <Link
                    to="/play/premium"
                    className="block bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg shadow-pink-100 relative overflow-hidden group hover:scale-[1.01] transition-all"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <Crown className="w-16 h-16" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-5 h-5 fill-white" />
                            <h2 className="text-lg font-black uppercase tracking-tight">Get Premium Access</h2>
                        </div>
                        <p className="text-white/80 text-sm font-bold mb-4 max-w-[240px]">
                            Unlock unlimited clinical cases, insights, and past challenges today!
                        </p>
                        <div className="inline-flex items-center gap-2 bg-white text-pink-600 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm">
                            Upgrade Now
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                </Link>
            )}

            {/* Settings Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Refer a Friend */}
                <button
                    onClick={handleShareWithFriend}
                    className="w-full flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition text-left group"
                >
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:scale-110 transition">
                        <Gift className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                        <span className="text-base font-bold text-gray-900">Refer a Friend</span>
                        <span className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg">
                            <Star className="text-red-500 w-3 h-3 fill-red-500" />
                            <span className="text-xs font-black text-red-500">+100</span>
                        </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>

                <div className="h-px bg-gray-50 ml-[72px]" />

                {/* Rate the App */}
                <a
                    href="https://play.google.com/store/apps/details?id=com.diagnoseit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition group"
                >
                    <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center group-hover:scale-110 transition">
                        <Star className="w-5 h-5 text-pink-500 fill-pink-500" />
                    </div>
                    <span className="flex-1 text-base font-bold text-gray-900">Rate the App</span>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                </a>

                <div className="h-px bg-gray-50 ml-[72px]" />

                {/* Privacy Policy */}
                <Link
                    to="/privacy"
                    className="w-full flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition group"
                >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition">
                        <Shield className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="flex-1 text-base font-bold text-gray-900">Privacy Policy</span>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                </Link>

                <div className="h-px bg-gray-50 ml-[72px]" />

                {/* Terms of Service */}
                <Link
                    to="/terms"
                    className="w-full flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition group"
                >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition">
                        <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="flex-1 text-base font-bold text-gray-900">Terms of Service</span>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                </Link>
            </div>

            {/* Logout Button */}
            <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-5 font-black text-white shadow-lg shadow-pink-200 transition hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
            >
                <LogOut className="w-5 h-5" />
                <span>Log out</span>
            </button>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <LogOut className="h-8 w-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Log out</h3>
                        <p className="text-gray-500 mb-8 font-medium">Are you sure you want to log out of your account?</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 py-4 rounded-xl border border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 py-4 rounded-xl bg-red-500 font-bold text-white hover:bg-red-600 transition shadow-lg shadow-red-100"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
