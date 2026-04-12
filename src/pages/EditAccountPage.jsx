import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, User, Mail, Lock, Check, Trash2, Loader2 } from 'lucide-react';
import { updateUser } from '@/store/slices/userSlice';
import CloudBottom from '@/components/CloudBottom';

export default function EditAccountPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userData, status } = useSelector(state => state.user);

    const [name, setName] = useState(userData?.displayName || userData?.name || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const email = userData?.email || '';

    const handleUpdate = useCallback(async () => {
        if (!name.trim()) {
            alert('Name cannot be empty');
            return;
        }

        const userId = userData?._id;
        if (!userId) {
            alert('Unable to identify user. Please try logging out and back in.');
            return;
        }

        setIsUpdating(true);
        try {
            await dispatch(updateUser({
                userId,
                userData: { displayName: name.trim() }
            })).unwrap();

            alert('Your profile has been updated');
            navigate(-1);
        } catch (error) {
            alert(error?.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    }, [name, userData, dispatch, navigate]);

    const handleDeleteAccount = useCallback(async () => {
        // In a real app, this would call a DELETE API
        alert('Account deletion functionality is not available in the web version yet.');
        setShowDeleteConfirm(false);
    }, []);

    const isLoading = isUpdating || status === 'loading';

    return (
        <div className="min-h-screen bg-[#F8F9FA] relative pb-20">
            {/* Subtle Pink Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFF7FA] via-[#FFEAF2] to-[#FFD6E5] h-64 pointer-events-none" />

            <div className="relative max-w-2xl mx-auto px-4 pt-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition"
                    >
                        <ArrowLeft className="h-6 w-6 text-gray-800" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
                    <div className="w-10" />
                </div>

                {/* Avatar */}
                <div className="flex justify-center mb-10">
                    <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center shadow-lg border-4 border-white">
                        <span className="text-4xl font-extrabold text-pink-600">
                            {(name?.[0] || email?.[0] || 'U').toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-6 mb-10">
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Name</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <User className="h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition disabled:opacity-70"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Email Input (Disabled/Read-only) */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Mail className="h-5 w-5" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                readOnly
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-gray-500 font-medium cursor-not-allowed"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Lock className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 italic ml-1">Email cannot be changed</p>
                    </div>
                </div>

                {/* Update Button */}
                <button
                    onClick={handleUpdate}
                    disabled={isLoading}
                    className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-200 transition flex items-center justify-center gap-2 mb-12"
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            <Check className="h-5 w-5" />
                            <span>Update Profile</span>
                        </>
                    )}
                </button>

                {/* Danger Zone */}
                <div className="pt-8 border-t border-red-100 flex flex-col items-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-5 h-px bg-red-200" />
                        <div className="flex items-center gap-1.5 text-red-600">
                            <Trash2 className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Danger Zone</span>
                        </div>
                        <div className="w-5 h-px bg-red-200" />
                    </div>
                    <p className="text-xs text-gray-400 text-center mb-6">Actions here are irreversible. Please proceed with caution.</p>

                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2"
                    >
                        <Trash2 className="h-5 w-5" />
                        <span>Delete Account</span>
                    </button>
                </div>
            </div>

            {/* Cloud Bottom Decoration */}
            <div className="mt-12 opacity-30 pointer-events-none">
                <CloudBottom height={160} color="#FF407D" />
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Account</h3>
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data, including game progress and scores.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="flex-1 py-3 rounded-xl bg-red-500 font-semibold text-white hover:bg-red-600 transition shadow-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
