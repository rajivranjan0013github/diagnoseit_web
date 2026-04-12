import React, { useEffect } from 'react';
import { Link, NavLink, useLocation, Outlet } from 'react-router-dom';
import { Heart, User, Home, Briefcase, Trophy } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { getUser } from '@/store/slices/userSlice';
import Image from '@/components/Image';
import CloudBottom from '@/components/CloudBottom';
import { Footer } from '@/components/footer';

function AppHeader() {
    const dispatch = useAppDispatch();
    const { hearts, userData, isPremium } = useAppSelector((state) => state.user);

    // Fetch full user data on mount if we only have basic info
    React.useEffect(() => {
        if (userData?._id && (!userData.cumulativePoints || hearts === 5)) {
            dispatch(getUser(userData._id));
        }
    }, [userData?._id, dispatch]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-pink-100 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
                <div className="flex items-center gap-2">
                    <Link to="/play" className="flex items-center gap-2">
                        <span className="text-2xl font-[800] text-[#FF407D] tracking-tight">Diagnose it</span>
                    </Link>

                    {/* Premium Badge / Upgrade Button */}
                    <Link to="/play/premium" className="ml-1">
                        {isPremium ? (
                            <div className="px-2 py-0.5 rounded-full bg-[#08C634] shadow-[0_4px_10px_rgba(0,196,179,0.2)]">
                                <span className="text-[10px] font-[800] text-white uppercase tracking-wider">Pro</span>
                            </div>
                        ) : (
                            <div className="px-2 py-0.5 rounded-full border border-[#08C634] hover:bg-[#08C634]/5 transition-colors">
                                <span className="text-[10px] font-[800] text-[#08C634] uppercase tracking-wider">Upgrade</span>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Navigation Links (Center Desktop) */}
                <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
                    <NavLink 
                        to="/play" 
                        end
                        className={({ isActive }) => 
                            `text-sm font-bold transition-colors hover:text-pink-600 ${isActive ? 'text-pink-600 underline decoration-2 underline-offset-8' : 'text-gray-500'}`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink 
                        to="/play/past-challenges" 
                        className={({ isActive }) => 
                            `text-sm font-bold transition-colors hover:text-pink-600 ${isActive ? 'text-pink-600 underline decoration-2 underline-offset-8' : 'text-gray-500'}`
                        }
                    >
                        Daily Challenges
                    </NavLink>
                    <NavLink 
                        to="/play/clinical-insight" 
                        className={({ isActive }) => 
                            `text-sm font-bold transition-colors hover:text-pink-600 ${isActive ? 'text-pink-600 underline decoration-2 underline-offset-8' : 'text-gray-500'}`
                        }
                    >
                        Solved Cases
                    </NavLink>
                    <NavLink 
                        to="/play/leaderboard" 
                        className={({ isActive }) => 
                            `text-sm font-bold transition-colors hover:text-pink-600 ${isActive ? 'text-pink-600 underline decoration-2 underline-offset-8' : 'text-gray-500'}`
                        }
                    >
                        Leaderboard
                    </NavLink>
                </nav>

                <div className="flex items-center gap-3">
                    {/* Hearts and Points Pill - Matching Mobile LeagueHeader */}
                    <Link
                        to="/play/hearts"
                        className="flex h-10 items-center gap-3 rounded-2xl border border-[#EAEAEA] bg-white px-3 py-2 shadow-[0_4px_8px_rgba(30,136,229,0.06)] transition hover:shadow-md"
                    >
                        <div className="flex items-center gap-1.5 flex-shrink-1">
                            {/* Heart Icon Container */}
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFD1E1]">
                                <Heart className="h-3 w-3 fill-red-600 text-red-600" />
                            </div>
                            <span className="text-[14px] font-[800] text-[#333333]">{hearts}</span>
                        </div>

                        <div className="flex items-center gap-1.5 ml-1">
                            <img
                                src="/images/coin.png"
                                alt="Coins"
                                className="w-[20px] h-[20px] object-contain"
                            />
                            <span className="text-[14px] font-[800] text-[#333333]">
                                {Math.round(userData?.cumulativePoints?.total ?? (typeof userData?.cumulativePoints === 'number' ? userData.cumulativePoints : 0))}
                            </span>
                        </div>
                    </Link>

                    {/* Account button */}
                    <Link
                        to="/play/account"
                        className="hidden lg:flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 transition hover:bg-pink-100 border border-pink-100/50"
                    >
                        <User className="h-5 w-5 text-pink-600" />
                    </Link>
                </div>
            </div>
        </header>
    );
}

function MobileNavbar() {
    const location = useLocation();
    
    const navItems = [
        { label: 'Home', icon: Home, path: '/play' },
        { label: 'My Case', icon: Briefcase, path: '/play/clinical-insight' },
        { label: 'Leaderboard', icon: Trophy, path: '/play/leaderboard' },
        { label: 'Profile', icon: User, path: '/play/account' },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-pink-100/50 flex justify-around items-center px-4 py-3 shadow-[0_-8px_24px_rgba(255,64,125,0.08)] rounded-t-[32px]">
            {navItems.map((item) => {
                const isActive = item.path === '/play' 
                    ? location.pathname === '/play'
                    : location.pathname.startsWith(item.path);

                return (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        className="flex flex-col items-center gap-1 group relative py-1"
                    >
                        <div className={`p-2 rounded-2xl transition-all duration-300 ease-out ${
                            isActive 
                                ? 'bg-pink-100 text-pink-600 scale-105 shadow-sm' 
                                : 'text-gray-400 group-hover:text-gray-600 group-active:scale-95'
                        }`}>
                            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-[800] uppercase tracking-wider transition-all duration-300 ${
                            isActive ? 'text-pink-600 opacity-100 translate-y-0' : 'text-gray-400 opacity-60 translate-y-0.5'
                        }`}>
                            {item.label}
                        </span>
                        
                        {isActive && (
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full shadow-[0_0_8px_#FF407D]" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}

export function AppLayout() {
    const location = useLocation();
    const pathname = location.pathname;

    // Scroll to top on every route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // Hide CloudBottom and Footer on gameplay pages (case pages)
    const isGameplayPage = pathname?.includes('/case/');

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-white flex flex-col relative">
            <AppHeader />
            <main className={`flex-1 pt-6 ${!isGameplayPage ? 'pb-24 lg:pb-0' : ''}`}>
                <Outlet />
            </main>
            {!isGameplayPage && <MobileNavbar />}
            {!isGameplayPage && <CloudBottom height={160} color="#FF407D" opacity={0.35} />}
            {!isGameplayPage && <Footer />}
        </div>
    );
}

export default AppLayout;
