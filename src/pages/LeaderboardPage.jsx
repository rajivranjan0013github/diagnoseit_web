import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Calendar, ChevronLeft, Star, Loader2, Share2, Crown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOverallTop10, fetchTodayLeaderboard } from '@/store/slices/leaderboardSlice';

// Helper for initials
const getInitials = (name) => {
    if (!name || name === '...') return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
};

const getAvatarColor = (rank) => {
    const colors = ['bg-pink-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500', 'bg-red-500', 'bg-indigo-500', 'bg-yellow-500', 'bg-cyan-500'];
    return colors[(rank - 1) % colors.length];
};

export default function LeaderboardPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState('overall');

    const { userData } = useAppSelector((state) => state.user);
    const {
        overallItems,
        overallStatus,
        dailyItems,
        dailyStatus,
        myOverallRank,
        myDailyRank,
    } = useAppSelector((state) => state.leaderboard);

    const currentUserId = userData?._id;

    useEffect(() => {
        if (currentUserId) {
            dispatch(fetchOverallTop10(currentUserId));
            dispatch(fetchTodayLeaderboard(currentUserId));
        }
    }, [dispatch, currentUserId]);

    const items = activeTab === 'overall' ? overallItems : dailyItems;
    const myRank = activeTab === 'overall' ? myOverallRank : myDailyRank;
    const isLoading = activeTab === 'overall' ? overallStatus === 'loading' : dailyStatus === 'loading';

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Diagnose It Leaderboard',
                text: `I'm ranked ${myOverallRank?.rank || '...'} on Diagnose It!`,
                url: window.location.origin + '/play/leaderboard',
            }).catch(() => { });
        }
    };

    const LeaderboardItem = ({ item, isMe }) => {
        const medal = getMedal(item.rank);
        const avatarColor = getAvatarColor(item.rank);
        const initials = getInitials(item.name);
        const isTopThree = item.rank <= 3;

        return (
            <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isMe ? 'bg-emerald-50 border-2 border-emerald-200' : isTopThree ? 'bg-amber-50/50 border border-amber-100' : 'bg-white border border-gray-100'} mb-2`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isTopThree ? 'bg-amber-100' : 'bg-gray-100'}`}>{medal || item.rank}</div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${avatarColor}`}>{initials}</div>
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate flex items-center gap-2">
                        {item.name}
                        {item.isPremium && (
                            <Crown className="h-3.5 w-3.5 text-amber-500 fill-amber-200 flex-shrink-0" />
                        )}
                        {isMe && <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">YOU</span>}
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-gray-700">{Math.round(item.score)}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto pb-24 px-4 min-h-screen">
            <div className="flex items-center justify-between p-4 sticky top-0 bg-white/90 backdrop-blur-md z-20">
                <button onClick={() => navigate(-1)} className="p-2"><ChevronLeft className="h-6 w-6" /></button>
                <div className="flex items-center gap-2"><Trophy className="h-6 w-6 text-amber-500" /><h1 className="text-xl font-bold">Leaderboard</h1></div>
                <button onClick={handleShare} className="p-2"><Share2 className="h-5 w-5" /></button>
            </div>

            <div className="flex p-1.5 bg-gray-100 rounded-xl mt-4 mb-6">
                {['overall', 'daily'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2.5 rounded-lg font-semibold text-sm ${activeTab === tab ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}>
                        {tab === 'overall' ? 'All Time' : 'Today'}
                    </button>
                ))}
            </div>

            <div className="px-4">
                {isLoading ? <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto h-10 w-10 text-pink-500" /></div> : (
                    <>
                        <div className="flex items-center px-3 py-2 text-[10px] font-bold text-gray-400 mb-2 uppercase">
                            <span className="w-8 text-center">Rank</span><span className="flex-1 ml-14">Player</span><span>Score</span>
                        </div>
                        {items.map(item => <LeaderboardItem key={item.userId} item={item} isMe={String(currentUserId) === String(item.userId)} />)}
                    </>
                )}
            </div>
        </div>
    );
}
