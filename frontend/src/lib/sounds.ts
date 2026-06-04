const STORAGE_KEY = 'zerohour_sound_enabled';

let audioCtx: AudioContext | null = null;
let enabled = loadPreference();

function loadPreference(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null ? stored === 'true' : true;
  } catch {
    return true;
  }
}

function savePreference(val: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(val));
  } catch { /* noop */ }
}

function ctx(): AudioContext | null {
  if (!enabled) return null;
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.08,
  freqEnd?: number,
) {
  const c = ctx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  if (freqEnd) {
    osc.frequency.linearRampToValueAtTime(freqEnd, c.currentTime + duration);
  }
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + duration);
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export function setSoundEnabled(val: boolean) {
  enabled = val;
  savePreference(val);
  if (!val) {
    audioCtx?.close();
    audioCtx = null;
  }
}

export function toggleSound(): boolean {
  setSoundEnabled(!enabled);
  return enabled;
}

/** Short tick — countdown second change */
export function playTick() {
  tone(880, 0.05, 'sine', 0.03);
}

/** Ascending blip — ticket purchase success */
export function playBuy() {
  tone(520, 0.12, 'sine', 0.07, 880);
}

/** Celebration sweep — airdrop win */
export function playWin() {
  const c = ctx();
  if (!c) return;
  const now = c.currentTime;
  [523, 659, 784, 1047].forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.08);
    gain.gain.setValueAtTime(0.06, now + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.2);
  });
}

/** Dramatic descending sweep — round ended / jackpot */
export function playJackpot() {
  const c = ctx();
  if (!c) return;
  const now = c.currentTime;
  // Low rumble
  tone(80, 0.6, 'sawtooth', 0.04, 40);
  // Descending sweep
  setTimeout(() => tone(600, 0.35, 'sine', 0.06, 200), 100);
  // Victory chord
  setTimeout(() => {
    [523, 659, 784].forEach((freq, i) => {
      tone(freq, 0.4, 'triangle', 0.05);
    });
  }, 400);
}

/** Coin/clink — dividend claim */
export function playClaim() {
  tone(1200, 0.08, 'sine', 0.06, 1600);
  setTimeout(() => tone(1600, 0.06, 'sine', 0.05, 2000), 60);
}

/** Gentle error buzz */
export function playError() {
  tone(200, 0.2, 'sawtooth', 0.04, 150);
}
