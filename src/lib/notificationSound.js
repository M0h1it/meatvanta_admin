/**
 * Short two-tone chime generated with the Web Audio API - no audio file to
 * host or load.
 *
 * Browsers refuse to play audio until the user has interacted with the page,
 * so installAudioUnlock() listens for the first interaction of any kind and
 * primes the context then. It's installed at app startup (main.jsx) rather
 * than inside a component, so it's already listening on the login screen -
 * the click that submits the login form is what unlocks it.
 */
let audioContext = null;

function createContext() {
  if (audioContext) return audioContext;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    audioContext = new AudioCtx();
    return audioContext;
  } catch {
    return null; // audio simply won't play - never break the app over it
  }
}

export function unlockAudio() {
  const ctx = createContext();
  if (ctx && ctx.state === "suspended") ctx.resume();
}

/** Call once at app startup. Unlocks on the first click, tap, or keypress. */
export function installAudioUnlock() {
  const events = ["click", "touchstart", "keydown"];

  function handleFirstInteraction() {
    unlockAudio();
    events.forEach((e) => window.removeEventListener(e, handleFirstInteraction));
  }

  events.forEach((e) => window.addEventListener(e, handleFirstInteraction, { once: false }));
}

export function isAudioReady() {
  return !!audioContext && audioContext.state === "running";
}

function playTone(ctx, startTime, frequency, duration) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  // Quick fade in/out so it sounds like a chime rather than a click.
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export function playNotificationSound() {
  const ctx = createContext();
  if (!ctx) return;

  // resume() is async - schedule the tones once it's actually running, or the
  // notes get scheduled against a clock that hasn't started and are lost.
  const schedule = () => {
    try {
      const now = ctx.currentTime + 0.05; // small offset so nothing is scheduled in the past
      playTone(ctx, now, 880, 0.18); // A5
      playTone(ctx, now + 0.16, 1174.66, 0.3); // D6
    } catch {
      // Ignore - a missed sound should never surface as an error.
    }
  };

  if (ctx.state === "suspended") {
    ctx.resume().then(schedule).catch(() => {});
  } else {
    schedule();
  }
}
