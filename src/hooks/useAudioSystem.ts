import { useCallback, useRef, useEffect, useState } from 'react';

// Audio context singleton
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

// Generate error sound
function playErrorTone() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Unlock audio context if needed
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(150, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);

  gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.3);
}

// Generate success sound
function playSuccessTone() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const notes = [523, 659, 784]; // C5, E5, G5
  notes.forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = freq;

    gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
    gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * 0.1 + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.2);

    oscillator.start(ctx.currentTime + i * 0.1);
    oscillator.stop(ctx.currentTime + i * 0.1 + 0.2);
  });
}

// Generate click sound
function playClickTone() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.value = 800;

  gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.05);
}

// Generate victory fanfare
function playVictoryFanfare() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const melody = [
    { freq: 523, time: 0, duration: 0.15 },
    { freq: 587, time: 0.1, duration: 0.15 },
    { freq: 659, time: 0.2, duration: 0.15 },
    { freq: 784, time: 0.3, duration: 0.15 },
    { freq: 880, time: 0.4, duration: 0.15 },
    { freq: 1047, time: 0.6, duration: 0.4 },
  ];

  melody.forEach(({ freq, time, duration }) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = freq;

    gainNode.gain.setValueAtTime(0, ctx.currentTime + time);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + time + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + duration);

    oscillator.start(ctx.currentTime + time);
    oscillator.stop(ctx.currentTime + time + duration);
  });
}

// Generate game over sound
function playGameOverTone() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const notes = [392, 349, 330, 262]; // G4, F4, E4, C4 - descending sad tone
  notes.forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.value = freq;

    gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.25);
    gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * 0.25 + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.25 + 0.3);

    oscillator.start(ctx.currentTime + i * 0.25);
    oscillator.stop(ctx.currentTime + i * 0.25 + 0.3);
  });
}

// Background music generator - relaxing ambient tones
class BackgroundMusic {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isPlaying = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  start() {
    if (this.isPlaying) return;
    
    this.ctx = getAudioContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.03; // Very quiet background
    this.gainNode.connect(this.ctx.destination);

    this.isPlaying = true;
    this.playAmbientChord();
    
    // Change chord every 8 seconds
    this.intervalId = setInterval(() => {
      if (this.isPlaying) {
        this.playAmbientChord();
      }
    }, 8000);
  }

  private playAmbientChord() {
    if (!this.ctx || !this.gainNode) return;

    // Stop previous oscillators
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch { /* ignore */ }
    });
    this.oscillators = [];

    // Relaxing ambient chord progressions (C major, F major, G major, Am)
    const chords = [
      [261.63, 329.63, 392.00], // C major
      [349.23, 440.00, 523.25], // F major  
      [392.00, 493.88, 587.33], // G major
      [220.00, 261.63, 329.63], // A minor
    ];

    const chord = chords[Math.floor(Math.random() * chords.length)];

    chord.forEach(freq => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();

      osc.connect(oscGain);
      oscGain.connect(this.gainNode!);

      osc.type = 'sine';
      osc.frequency.value = freq;

      // Slow fade in and hold
      oscGain.gain.setValueAtTime(0, this.ctx!.currentTime);
      oscGain.gain.linearRampToValueAtTime(0.3, this.ctx!.currentTime + 2);
      oscGain.gain.linearRampToValueAtTime(0.3, this.ctx!.currentTime + 6);
      oscGain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 8);

      osc.start(this.ctx!.currentTime);
      osc.stop(this.ctx!.currentTime + 8.5);

      this.oscillators.push(osc);
    });
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch { /* ignore */ }
    });
    this.oscillators = [];
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume * 0.05; // Max 5% volume
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

const backgroundMusic = new BackgroundMusic();

export function useAudioSystem(soundEnabled: boolean, musicEnabled: boolean) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const hasInteracted = useRef(false);

  // Handle music on/off
  useEffect(() => {
    if (musicEnabled && hasInteracted.current) {
      backgroundMusic.start();
      setIsMusicPlaying(true);
    } else {
      backgroundMusic.stop();
      setIsMusicPlaying(false);
    }

    return () => {
      backgroundMusic.stop();
    };
  }, [musicEnabled]);

  const enableAudioOnInteraction = useCallback(() => {
    if (!hasInteracted.current) {
      hasInteracted.current = true;
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
      if (musicEnabled) {
        backgroundMusic.start();
        setIsMusicPlaying(true);
      }
    }
  }, [musicEnabled]);

  const playError = useCallback(() => {
    if (soundEnabled) {
      playErrorTone();
    }
  }, [soundEnabled]);

  const playSuccess = useCallback(() => {
    if (soundEnabled) {
      playSuccessTone();
    }
  }, [soundEnabled]);

  const playClick = useCallback(() => {
    if (soundEnabled) {
      playClickTone();
    }
  }, [soundEnabled]);

  const playVictory = useCallback(() => {
    if (soundEnabled) {
      playVictoryFanfare();
    }
  }, [soundEnabled]);

  const playGameOver = useCallback(() => {
    if (soundEnabled) {
      playGameOverTone();
    }
  }, [soundEnabled]);

  const toggleMusic = useCallback(() => {
    if (backgroundMusic.getIsPlaying()) {
      backgroundMusic.stop();
      setIsMusicPlaying(false);
    } else {
      hasInteracted.current = true;
      backgroundMusic.start();
      setIsMusicPlaying(true);
    }
  }, []);

  return {
    playError,
    playSuccess,
    playClick,
    playVictory,
    playGameOver,
    toggleMusic,
    isMusicPlaying,
    enableAudioOnInteraction,
  };
}
