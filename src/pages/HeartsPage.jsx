'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Heart,
    Clock,
    Diamond,
    Gift,
    Check,
    Share2,
    Loader2,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import Image from '@/components/Image';
import { applyReferralCode } from '@/lib/api';

const MAX_HEARTS_DISPLAY = 2;

export default function HeartsPage() {
    const { hearts, isPremium, userData } = useAppSelector((state) => state.user);
    const heartsToShow = Math.min(hearts, MAX_HEARTS_DISPLAY);
    const referralCode = userData?.referralCode || '';

    const [friendCode, setFriendCode] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [codeApplied, setCodeApplied] = useState(false);
    const [codeMessage, setCodeMessage] = useState(null);



    // Share with friend
    const handleShareWithFriend = useCallback(async () => {
        const shareMessage = referralCode
            ? `🩺 Learning medicine the real way!
Diagnose It lets you treat patients step-by-step like real OPD cases.
Use my referral code ${referralCode} while signing up ❤️
Join me 👉 https://diagnoseit.in`
            : '🎯 Hey! I\'m solving real clinical cases with Diagnose It! It is real and fun - you can treat patients like a real doctor. Join here: https://diagnoseit.in';

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
        } catch (error) {
            // User cancelled or error
        }
    }, [referralCode]);

    // Apply friend's referral code
    const handleApplyFriendCode = useCallback(async () => {
        if (!friendCode.trim()) return;

        setIsApplying(true);
        setCodeMessage(null);

        try {
            const userId = userData?._id;
            const data = await applyReferralCode(userId, friendCode.trim().toUpperCase());

            if (data.success) {
                setCodeApplied(true);
                setFriendCode('');
                setCodeMessage({ type: 'success', text: 'Referral code applied. Your friend received a heart!' });
            } else {
                setCodeMessage({ type: 'error', text: data.message || 'Invalid or already used code.' });
            }
        } catch (error) {
            setCodeMessage({ type: 'error', text: error.message || 'Could not apply the code. Please try again.' });
        } finally {
            setIsApplying(false);
        }
    }, [friendCode, userData?._id]);

    // If premium, show different content
    if (isPremium) {
        return (
            <div className="max-w-2xl mx-auto space-y-6 pb-24 px-4">
                {/* Hero Section */}
                <div className="text-center py-8">
                    <div className="relative inline-block">
                        <div className="w-60 h-60 mx-auto relative flex items-center justify-center">
                            <img
                                src="/heart.png"
                                alt="Heart"
                                className="w-full h-full object-contain drop-shadow-lg"
                            />
                            <span className="absolute top-0 right-0 text-4xl font-bold text-pink-600">∞</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-extrabold text-pink-600 mt-4">Unlimited Hearts!</h1>
                    <p className="text-gray-600 mt-2">As a Premium member, you have unlimited hearts.</p>
                </div>

                {/* Premium Benefits Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Your Premium Benefits</h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-teal-500" />
                            <span className="text-gray-700"><span className="font-bold">Unlimited Hearts</span> – Play as many cases as you want</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-teal-500" />
                            <span className="text-gray-700"><span className="font-bold">Clinical Insights</span> – Deep dive into each case</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-teal-500" />
                            <span className="text-gray-700"><span className="font-bold">Video Analysis & Slide Decks</span> – Premium content</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-24 px-4">
            {/* Hero Section */}
            <div className="text-center py-6">
                <div className="w-56 h-56 mx-auto relative flex items-center justify-center">
                    <img
                        src="/heart.png"
                        alt="Heart"
                        className="w-full h-full object-contain drop-shadow-lg"
                    />
                </div>
                <p className="text-lg mt-4">
                    <span className="font-extrabold text-pink-600 text-xl">1 Heart = 1 Case</span>
                </p>
            </div>

            {/* Current Hearts Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                {/* Hearts Display */}
                <div className="flex justify-center gap-4 mb-4">
                    {Array.from({ length: MAX_HEARTS_DISPLAY }).map((_, idx) => (
                        <Heart
                            key={idx}
                            className={`w-12 h-12 ${idx < heartsToShow ? 'text-red-500 fill-red-500' : 'text-gray-300'}`}
                        />
                    ))}
                </div>

                {/* Hearts Count */}
                <div className="text-center mb-4">
                    <p className="text-lg font-bold text-gray-800">
                        Today's <span className="text-red-500 text-xl">{hearts}</span> {hearts === 1 ? 'Heart' : 'Hearts'} Left
                    </p>
                </div>

            </div>

            {/* Want to play more? Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xl font-extrabold text-pink-600 mb-4">Want to play more today?</h2>

                {/* Premium Option */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Diamond className="w-4 h-4 text-indigo-500" />
                        </div>
                        <span className="text-base font-bold text-gray-800">Get Premium</span>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-teal-500" />
                            <span className="text-sm text-gray-700">Unlock <span className="font-bold">Unlimited Hearts</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-teal-500" />
                            <span className="text-sm text-gray-700">Access <span className="font-bold">Clinical Insight</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-teal-500" />
                            <span className="text-sm text-gray-700">Access <span className="font-bold">Video analysis and Slide Decks</span></span>
                        </div>
                    </div>

                    <Link
                        to="/play/account"
                        className="block w-full text-center bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition"
                    >
                        Get Premium →
                    </Link>
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs font-bold text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Referral Option */}
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                            <Gift className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="text-base font-bold text-gray-800">Get one more Heart</span>
                        <span className="ml-auto flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg">
                            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                            <span className="text-xs font-bold text-red-500">+1</span>
                        </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                        Share your code with <span className="font-bold text-gray-900">friends</span>. When they enter it, you get a <span className="font-bold text-gray-900">free heart!</span>
                    </p>

                    {/* Referral Code Display */}
                    {referralCode && (
                        <div className="bg-red-50 border-2 border-dashed border-pink-200 rounded-xl p-4 text-center mb-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Your Referral Code</p>
                            <p className="text-2xl font-extrabold text-gray-900">{referralCode}</p>
                        </div>
                    )}

                    {/* Share Button */}
                    <button
                        onClick={handleShareWithFriend}
                        className="w-full flex items-center justify-center gap-2 border border-gray-200 bg-gray-50 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-100 transition"
                    >
                        <Share2 className="w-4 h-4" />
                        Share Code
                    </button>

                    {/* Enter Friend's Code Section */}
                    {!codeApplied && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-sm font-semibold text-gray-700 mb-3">Have a friend's code?</p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    value={friendCode}
                                    onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-900 font-semibold uppercase placeholder:text-gray-400 placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleApplyFriendCode}
                                    disabled={!friendCode.trim() || isApplying}
                                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition"
                                >
                                    {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Apply'}
                                </button>
                            </div>

                            {/* Message */}
                            {codeMessage && (
                                <p className={`mt-3 text-sm font-medium ${codeMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                    {codeMessage.text}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Code Applied Badge */}
                    {codeApplied && (
                        <div className="mt-4 flex items-center gap-2 text-green-600">
                            <Check className="w-4 h-4" />
                            <span className="text-sm font-semibold">Friend's code applied!</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
