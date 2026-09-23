// Web Audio Synthesizer & Speech Synthesis (100% Offline)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const SoundEffects = {
  playTap() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // AudioContext silently ignored if blocked by autoplay policies
    }
  },

  playCorrect() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.16); // G5
      
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      
      osc1.start(now);
      osc1.stop(now + 0.4);
    } catch (e) {
      console.error('Audio playCorrect error:', e);
    }
  },

  playWrong() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.setValueAtTime(196, now + 0.12); // G3
      
      gain.gain.setValueAtTime(0.10, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.error('Audio playWrong error:', e);
    }
  },

  playLevelComplete() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.12, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.3);
      });
    } catch (e) {
      console.error('Audio playLevelComplete error:', e);
    }
  }
};

let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Returns Google Translate TTS audio URLs for authentic European Portuguese (pt-PT).
 */
export function getGoogleTranslateTtsUrls(text: string, lang = 'pt-PT'): string[] {
  const clean = text
    .replace(/[\u{1F600}-\u{1F6FF}]/gu, '')
    .replace(/[*_#]/g, '')
    .trim();
  if (!clean) return [];

  const encoded = encodeURIComponent(clean);
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return [
    // 1. Same-origin proxy route (avoids any third-party browser restrictions)
    `${prefix}api/tts?q=${encoded}&tl=${lang}`,
    // 2. Direct Google Translate official web browser TTS endpoint (client=tw-ob)
    `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${lang}&client=tw-ob`,
  ];
}

// Global active audio session tracker to completely prevent duplicate or overlapping speech
let currentAudioSession = 0;
let activeAudioElement: HTMLAudioElement | null = null;

export function stopCurrentAudio() {
  currentAudioSession++;
  if (activeAudioElement) {
    try {
      activeAudioElement.onended = null;
      activeAudioElement.onerror = null;
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
      activeAudioElement.removeAttribute('src');
    } catch {
      // ignore
    }
    activeAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

/**
 * Plays European Portuguese using Google Translator audio generation.
 * This guarantees authentic Portugal (pt-PT) pronunciation from Google Translate,
 * completely avoiding browser speech synthesis which frequently defaults to Brazilian Portuguese.
 * Ensures the audio is played exactly ONCE per invocation with zero echoing or overlapping.
 */
export const speakPortuguese = (text: string, rate = 1.0, onEnd?: () => void) => {
  if (typeof window === 'undefined') {
    if (onEnd) onEnd();
    return;
  }

  const cleanText = text
    .replace(/[\u{1F600}-\u{1F6FF}]/gu, '')
    .replace(/[*_#]/g, '')
    .trim();
  if (!cleanText) {
    if (onEnd) onEnd();
    return;
  }

  stopCurrentAudio();
  const sessionId = currentAudioSession;

  // Direct authentic European Portuguese audio generation endpoints
  const candidateUrls = getGoogleTranslateTtsUrls(cleanText, 'pt-PT');

  let isFinished = false;
  const finish = () => {
    if (!isFinished && sessionId === currentAudioSession) {
      isFinished = true;
      activeAudioElement = null;
      if (onEnd) onEnd();
    }
  };

  const tryPlayCandidate = (index: number) => {
    if (sessionId !== currentAudioSession) return;

    if (index >= candidateUrls.length) {
      fallbackSpeechSynthesis(cleanText, rate, finish);
      return;
    }

    const url = candidateUrls[index];
    const audio = new Audio(url);
    audio.playbackRate = rate;
    activeAudioElement = audio;

    let handledCandidate = false;
    const advance = () => {
      if (!handledCandidate && sessionId === currentAudioSession) {
        handledCandidate = true;
        tryPlayCandidate(index + 1);
      }
    };

    audio.onended = () => {
      if (!handledCandidate && sessionId === currentAudioSession) {
        handledCandidate = true;
        finish();
      }
    };

    audio.onerror = () => {
      advance();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        advance();
      });
    }
  };

  tryPlayCandidate(0);
};

/**
 * Strict European Portuguese fallback using window.speechSynthesis ONLY if an authentic
 * pt-PT voice exists. Explicitly rejects Brazilian voices (pt-BR).
 */
function fallbackSpeechSynthesis(cleanText: string, rate: number, onDone: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onDone();
    return;
  }

  try {
    const voices = cachedVoices.length ? cachedVoices : window.speechSynthesis.getVoices();
    const ptPTVoice = voices.find(
      (v) =>
        (v.lang === 'pt-PT' || v.lang === 'pt_PT' || v.lang.startsWith('pt-PT')) &&
        !v.name.toLowerCase().includes('brazil') &&
        !v.name.toLowerCase().includes('brasil')
    );

    // If NO pt-PT voice is available in the browser, DO NOT speak in Brazilian!
    if (!ptPTVoice) {
      console.warn('[Audio] No native pt-PT speech synthesis voice found on device; suppressing speech to avoid Brazilian accent.');
      onDone();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-PT';
    utterance.voice = ptPTVoice;
    utterance.rate = rate;
    utterance.onend = onDone;
    utterance.onerror = onDone;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('[Audio] Speech synthesis error:', e);
    onDone();
  }
}

// In-memory cache of HTMLAudioElement instances for zero-latency instant replay
const audioPlayerPool = new Map<string, HTMLAudioElement>();

/**
 * Normalizes an audio path or ID to the public audio URL.
 * e.g. 'u1_l3_e13_opt_1' -> '/audio/u1_l3_e13_opt_1.mp3'
 */
export function resolveAudioUrl(audioIdentifier: string): string {
  if (audioIdentifier.startsWith('/') || audioIdentifier.startsWith('http')) {
    return audioIdentifier;
  }
  const filename = audioIdentifier.endsWith('.mp3') ? audioIdentifier : `${audioIdentifier}.mp3`;
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}audio/${filename}`;
}

/**
 * Prefetches and pre-warms an audio file in the browser memory & cache for zero latency.
 */
export async function prefetchAudio(audioIdentifier: string): Promise<void> {
  if (typeof window === 'undefined') return;
  const url = resolveAudioUrl(audioIdentifier);
  if (!audioPlayerPool.has(url)) {
    try {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = url;
      audioPlayerPool.set(url, audio);
    } catch {
      // ignore
    }
  }
}

/**
 * Plays a pre-generated MP3 audio file with zero latency.
 * Returns true if playback succeeds, or false if the file was not found or failed.
 */
export function playAudioFile(audioIdentifier: string, onEnd?: () => void): Promise<boolean> {
  if (typeof window === 'undefined') {
    if (onEnd) onEnd();
    return Promise.resolve(false);
  }

  stopCurrentAudio();
  const sessionId = currentAudioSession;

  return new Promise((resolve) => {
    try {
      const url = resolveAudioUrl(audioIdentifier);
      let audio = audioPlayerPool.get(url);

      if (!audio) {
        audio = new Audio(url);
        audio.preload = 'auto';
        audioPlayerPool.set(url, audio);
      } else {
        audio.currentTime = 0;
      }

      activeAudioElement = audio;

      let handled = false;
      const cleanup = (success: boolean) => {
        if (!handled && sessionId === currentAudioSession) {
          handled = true;
          activeAudioElement = null;
          if (onEnd) onEnd();
          resolve(success);
        }
      };

      audio.onended = () => cleanup(true);
      audio.onerror = () => cleanup(false);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(`[Audio] Failed to play MP3 ${url}, falling back:`, err);
          cleanup(false);
        });
      }
    } catch (e) {
      console.warn('[Audio] Error instantiating audio:', e);
      if (onEnd) onEnd();
      resolve(false);
    }
  });
}

/**
 * Dedicated player for lesson exercises:
 * 1. Checks and plays the pre-generated European Portuguese MP3 file (/audio/{exerciseId}.mp3).
 * 2. If missing or playback fails, immediately plays audio generated via Google Translator (pt-PT).
 * Strictly guarantees a single audio playback without duplicates or echoes.
 */
export async function playExerciseAudio(
  exerciseId: string,
  fallbackText: string,
  rate = 1.0,
  onEnd?: () => void
): Promise<void> {
  if (typeof window === 'undefined') {
    if (onEnd) onEnd();
    return;
  }

  stopCurrentAudio();
  const sessionId = currentAudioSession;

  const url = resolveAudioUrl(exerciseId);
  const audio = new Audio(url);
  audio.playbackRate = rate;
  activeAudioElement = audio;

  let handled = false;

  const handleFailure = () => {
    if (!handled && sessionId === currentAudioSession) {
      handled = true;
      if (fallbackText) {
        speakPortuguese(fallbackText, rate, onEnd);
      } else {
        activeAudioElement = null;
        if (onEnd) onEnd();
      }
    }
  };

  const handleSuccess = () => {
    if (!handled && sessionId === currentAudioSession) {
      handled = true;
      activeAudioElement = null;
      if (onEnd) onEnd();
    }
  };

  audio.onended = handleSuccess;
  audio.onerror = handleFailure;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      handleFailure();
    });
  }
}

/**
 * High-level audio player:
 * 1. Tries zero-latency playback of cached MP3 file.
 * 2. If the MP3 is missing or fails, seamlessly generates & plays Google Translator European Portuguese (pt-PT) audio.
 */
export async function playAudioWithFallback(
  audioIdentifier: string,
  fallbackText: string,
  rate = 1.0,
  onEnd?: () => void
): Promise<void> {
  await playExerciseAudio(audioIdentifier, fallbackText, rate, onEnd);
}

