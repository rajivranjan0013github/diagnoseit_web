import { useRef, useCallback, useEffect, useState } from 'react';

const S3_BASE_URL = 'https://gtdthousandways1.s3.ap-south-1.amazonaws.com/mp3files';

// Map slide index to speech part
export const slideToPart = {
    0: 'basicspeech',
    1: 'vitalsspeech',
    2: 'historyspeech',
    3: 'physicalspeech',
};

/**
 * Custom hook for audio playback on web
 * Fixed to prevent race conditions with React re-renders
 */
export function useAudio(playbackRate = 1.25) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUrl, setCurrentUrl] = useState(null);

    // Create audio element once on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && !audioRef.current) {
            const audio = new Audio();
            audio.playbackRate = playbackRate;
            audioRef.current = audio;

            // Event listeners
            audio.addEventListener('ended', () => {
                setIsPlaying(false);
                setCurrentUrl(null);
            });

            audio.addEventListener('error', () => {
                console.warn('Audio playback error:', audio.error);
                setIsPlaying(false);
                setIsLoading(false);
            });

            audio.addEventListener('canplaythrough', () => {
                setIsLoading(false);
            });

            audio.addEventListener('playing', () => {
                setIsPlaying(true);
                setIsLoading(false);
            });

            audio.addEventListener('pause', () => {
                setIsPlaying(false);
            });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
                audioRef.current = null;
            }
        };
    }, []); // Empty deps - only run once

    const play = useCallback((url) => {
        const audio = audioRef.current;
        if (!audio) {
            console.warn('Audio element not ready');
            return;
        }

        // If already playing this URL, do nothing
        if (audio.src === url && !audio.paused) {
            return;
        }

        // Stop current playback if any
        audio.pause();
        audio.currentTime = 0;

        // Set new source and play
        setIsLoading(true);
        setCurrentUrl(url);
        audio.src = url;
        audio.playbackRate = playbackRate;

        // Use a small delay to ensure the audio element is ready
        setTimeout(() => {
            audio.play().catch((err) => {
                console.warn('Audio play failed:', err.message);
                setIsLoading(false);
                setIsPlaying(false);
            });
        }, 100);
    }, [playbackRate]);

    const stop = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setIsLoading(false);
        setCurrentUrl(null);
    }, []);

    const toggle = useCallback((url) => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!audio.paused && audio.src === url) {
            audio.pause();
        } else {
            play(url);
        }
    }, [play]);

    return {
        isPlaying,
        isLoading,
        play,
        stop,
        toggle,
        currentUrl,
    };
}

/**
 * Get the S3 URL for a case speech audio file
 */
export function getCaseSpeechUrl(caseCode, part) {
    return `${S3_BASE_URL}/${caseCode}_${part}.mp3`;
}

/**
 * Custom hook specifically for Clinical Info page audio
 */
export function useCaseAudio(caseCode, options = {}) {
    const { playbackRate = 1.25 } = options;
    const audio = useAudio(playbackRate);

    const playForSlide = useCallback((slideIndex) => {
        if (!caseCode) {
            console.warn('No case code for audio playback');
            return;
        }

        const part = slideToPart[slideIndex];
        if (!part) {
            console.warn('No speech part for slide:', slideIndex);
            return;
        }

        const url = getCaseSpeechUrl(caseCode, part);
        console.log('Playing audio:', url);
        audio.play(url);
    }, [caseCode, audio]);

    const toggleForSlide = useCallback((slideIndex) => {
        if (!caseCode) return;

        const part = slideToPart[slideIndex];
        if (!part) return;

        const url = getCaseSpeechUrl(caseCode, part);
        audio.toggle(url);
    }, [caseCode, audio]);

    return {
        ...audio,
        playForSlide,
        toggleForSlide,
    };
}

// Default voice to use if case doesn't have one
export const DEFAULT_VOICE_ID = 'bpjgufopiobt79j2vtj4';

/**
 * Get the local URL for screen-specific audio file
 */
export function getScreenAudioUrl(voiceId, screenType) {
    const id = voiceId || DEFAULT_VOICE_ID;
    return `/audio/${screenType}_${id.toLowerCase()}.mp3`;
}

/**
 * Custom hook for Tests/Diagnosis/Treatment screen audio
 * Auto-plays when mounted if voiceId is available (or uses default)
 */
export function useScreenAudio(voiceId, screenType, options = {}) {
    const { playbackRate = 1, autoPlay = true } = options;
    const audio = useAudio(playbackRate);
    const hasPlayedRef = useRef(false);

    // Resolve which voice to use
    const effectiveVoiceId = voiceId || DEFAULT_VOICE_ID;

    // Auto-play audio when component mounts
    useEffect(() => {
        if (!autoPlay || hasPlayedRef.current) {
            return;
        }

        // Delay to ensure component is ready
        const timer = setTimeout(() => {
            const url = getScreenAudioUrl(effectiveVoiceId, screenType);
            console.log(`Playing ${screenType} audio:`, url);
            audio.play(url);
            hasPlayedRef.current = true;
        }, 500);

        return () => {
            clearTimeout(timer);
            audio.stop();
        };
    }, [effectiveVoiceId, screenType, autoPlay]);

    const playAudio = useCallback(() => {
        const url = getScreenAudioUrl(effectiveVoiceId, screenType);
        audio.play(url);
    }, [effectiveVoiceId, screenType, audio]);

    return {
        ...audio,
        playAudio,
    };
}

/**
 * Custom hook for tap sound effect
 * Plays a short sound when user taps/clicks on options
 */
export function useTapSound() {
    const audioRef = useRef(null);

    // Create audio element once
    useEffect(() => {
        if (typeof window !== 'undefined' && !audioRef.current) {
            const audio = new Audio('/audio/tap_sound.wav');
            audio.volume = 0.5; // Lower volume for tap sound
            audioRef.current = audio;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current = null;
            }
        };
    }, []);

    const playTap = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Reset and play immediately
        audio.currentTime = 0;
        audio.play().catch(() => {
            // Ignore errors for tap sound
        });
    }, []);

    return { playTap };
}
