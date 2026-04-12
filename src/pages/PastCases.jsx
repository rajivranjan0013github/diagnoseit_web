import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGameplayHistory } from '@/store/slices/historySlice';
import { cleanText } from '@/lib/utils';
import Image from '@/components/Image';

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-3 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-5 bg-gray-200 rounded-full w-20" />
                </div>
                <div className="w-20 h-16 bg-gray-200 rounded-xl" />
            </div>
        </div>
    );
}

export default function PastCases() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { userData } = useAppSelector((state) => state.user);
    const { items, status, error } = useAppSelector((state) => state.history);

    const loading = status === 'loading';

    useEffect(() => {
        const userId = userData?._id || userData?.id;
        if (userId) {
            dispatch(fetchGameplayHistory(userId.toString()));
        }
    }, [dispatch, userData?._id, userData?.id]);

    const groupedByDate = useMemo(() => {
        const toKeyLabel = (createdAt) => {
            const d = new Date(createdAt);
            const key = d.toISOString().split('T')[0];
            const label = d.toLocaleDateString('en-IN', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            });
            return { key, label };
        };

        const map = new Map();
        items.forEach((it) => {
            const { key, label } = toKeyLabel(it.createdAt);
            if (!map.has(key)) {
                map.set(key, { label, items: [] });
            }
            map.get(key).items.push(it);
        });

        return Array.from(map.entries())
            .sort((a, b) => (a[0] < b[0] ? 1 : -1))
            .map(([, v]) => v);
    }, [items]);

    const getTitle = (it) => {
        if (it.sourceType === 'dailyChallenge') return cleanText(it.dailyChallenge?.title || 'Daily Challenge');
        return cleanText(it.case?.title || 'Clinical Case');
    };

    const getCategory = (it) => {
        if (it.sourceType === 'dailyChallenge') return cleanText(it.dailyChallenge?.category || 'Daily');
        return cleanText(it.case?.category || 'General');
    };

    const getDiagnosis = (it) => {
        if (it.sourceType === 'dailyChallenge') return cleanText(it.dailyChallenge?.correctDiagnosis || '');
        return cleanText(it.case?.correctDiagnosis || '');
    };

    const getMainImage = (it) => {
        if (it.sourceType === 'dailyChallenge') return it.dailyChallenge?.mainimage || null;
        return it.case?.mainimage || null;
    };

    return (
        <div className="max-w-3xl mx-auto pb-8 px-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-pink-100 rounded-xl"><BookOpen className="h-6 w-6 text-pink-600" /></div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Past Cases</h1>
                    <p className="text-gray-500 text-sm">Review your solved cases</p>
                </div>
            </div>

            {loading && items.length === 0 && (
                <div className="space-y-4">
                    <div className="h-5 bg-gray-200 rounded w-40 mb-3 animate-pulse" />
                    <SkeletonCard /><SkeletonCard /><SkeletonCard />
                </div>
            )}

            {!loading && error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">{error}</div>}

            {!loading && !error && items.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">📚</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">No cases solved yet</h2>
                    <button onClick={() => navigate('/play')} className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold">Start Playing</button>
                </div>
            )}

            {groupedByDate.map((group, idx) => (
                <div key={idx} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <h3 className="text-lg font-bold text-gray-700">{group.label}</h3>
                    </div>
                    <div className="space-y-3">
                        {group.items.map((it) => (
                            <button
                                key={it.gameplayId}
                                onClick={() => navigate(`/play/clinical-insight/${it.gameplayId}`)}
                                className={`w-full text-left bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border-2 ${it.sourceType === 'dailyChallenge' ? 'border-orange-400' : 'border-gray-100'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-gray-800 truncate">{getTitle(it)}</h4>
                                            {it.sourceType === 'dailyChallenge' && <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-md">Daily</span>}
                                        </div>
                                        <p className="text-sm text-gray-500 truncate mb-2">{getDiagnosis(it) || 'Clinical Case'}</p>
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md text-white ${it.sourceType === 'dailyChallenge' ? 'bg-orange-500' : 'bg-pink-400'}`}>{getCategory(it)}</span>
                                    </div>
                                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-gray-100 relative">
                                        {getMainImage(it) ? <Image src={getMainImage(it)} alt="Case" fill className="object-cover" unoptimized /> : <div className="w-full h-full flex items-center justify-center text-2xl">🩺</div>}
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
