import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setUser, getUser } from '@/store/slices/userSlice';
import { loginWithGoogle } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const from = location.state?.from?.pathname || "/play";

    const login = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            setIsLoading(true);
            try {
                const { code } = codeResponse;
                const result = await loginWithGoogle(code);

                if (result.success) {
                    dispatch(setUser(result.user));
                    // Fetch full user data (hearts, points) before navigating
                    dispatch(getUser(result.user._id));
                    navigate(from, { replace: true });
                } else {
                    alert('Login failed: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Google Login Error:', error);
                alert('Failed to connect to server. Please try again.');
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error) => {
            console.error('Login Failed:', error);
            alert('Google Login was unsuccessful. Please try again.');
        },
        flow: 'auth-code',
        redirect_uri: 'http://localhost:5173',
    });

    return (
        <div className="relative min-h-screen w-full bg-white flex flex-col items-center overflow-hidden">
            {/* Hero Image Section */}
            <div className="relative w-full h-[65vh] md:h-[70vh]">
                <img
                    src="/images/senior3.jpeg"
                    alt="Senior Doctor"
                    className="w-full h-full object-cover"
                />

                {/* Thought Bubble */}
                <div className="absolute top-24 left-8 right-8 z-10 max-w-xs">
                    <h2 className="text-2xl font-black text-gray-900 leading-tight">
                        The more you diagnose,<br />the better you become.
                    </h2>
                    {/* Thought Trail */}
                    <div className="mt-4 flex gap-2">
                        <div className="w-4 h-4 rounded-full bg-white shadow-md border border-gray-100" />
                        <div className="w-3 h-3 rounded-full bg-white/80 shadow-sm border border-gray-100 translate-y-2" />
                        <div className="w-2 h-2 rounded-full bg-white/60 shadow-sm border border-gray-100 translate-y-4" />
                    </div>
                </div>

                {/* Bottom Fade Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent" />
            </div>

            {/* CTA Section */}
            <div className="flex-1 w-full max-w-sm px-6 pb-12 flex flex-col items-center justify-end -translate-y-8 z-20">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
                        <p className="text-sm font-bold text-gray-500">Signing you in...</p>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={() => login()}
                            disabled={isLoading}
                            className="w-full bg-white border-2 border-gray-100 rounded-full py-4 px-6 flex items-center justify-center gap-4 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all group"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                            <span className="text-lg font-black text-gray-800">Continue with Google</span>
                        </button>

                        <p className="mt-8 text-center text-xs text-gray-400 px-4 leading-relaxed">
                            By continuing, you agree to our{' '}
                            <a href="/terms" className="text-pink-500 font-bold hover:underline">Terms of Service</a>
                            {' '}&{' '}
                            <a href="/privacy" className="text-pink-500 font-bold hover:underline">Privacy Policy</a>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
