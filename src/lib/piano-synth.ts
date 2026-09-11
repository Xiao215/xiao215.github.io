// A small additive piano voice built on Web Audio. Browsers only allow audio
// after a user gesture, so call `unlockAudio()` from a pointer or key handler
// before the first note; notes played before that are silently skipped.

export type PianoVoice = {
  envelope: GainNode;
  oscillators: OscillatorNode[];
  startedAt: number;
};

type NoteOptions = {
  velocity?: number;
  delay?: number;
  // Held notes sustain until `releaseNote`; others ring out on their own.
  held?: boolean;
};

const partials: [number, OscillatorType, number][] = [
  [1, "triangle", 1],
  [2, "sine", 0.4],
  [3, "sine", 0.15],
  [4, "sine", 0.06],
];

let context: AudioContext | null = null;
let output: GainNode | null = null;

export function unlockAudio() {
  if (!context) {
    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    context = new AudioContextClass();
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -16;
    compressor.ratio.value = 4;
    output = context.createGain();
    output.gain.value = 0.6;
    output.connect(compressor);
    compressor.connect(context.destination);
  }

  if (context.state === "suspended") {
    void context.resume();
  }
}

export function playNote(
  midi: number,
  { velocity = 0.8, delay = 0, held = false }: NoteOptions = {},
): PianoVoice | null {
  if (!context || !output) {
    return null;
  }

  const start = context.currentTime + delay + 0.005;
  const frequency = 440 * Math.pow(2, (midi - 69) / 12);
  const peak = 0.22 * Math.min(1, Math.max(0.05, velocity));

  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(peak, start + 0.006);
  envelope.gain.exponentialRampToValueAtTime(peak * 0.35, start + 0.3);
  envelope.gain.exponentialRampToValueAtTime(
    held ? peak * 0.08 : 0.0001,
    start + (held ? 2.2 : 1.8),
  );

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(Math.min(9000, frequency * 10), start);
  filter.frequency.exponentialRampToValueAtTime(
    Math.max(500, frequency * 2.5),
    start + 0.8,
  );
  envelope.connect(filter);
  filter.connect(output);

  const oscillators = partials.map(([multiple, type, amplitude]) => {
    const oscillator = context!.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency * multiple;
    oscillator.detune.value = multiple === 1 ? 0 : 3;
    const gain = context!.createGain();
    gain.gain.value = amplitude;
    oscillator.connect(gain);
    gain.connect(envelope);
    oscillator.start(start);

    if (!held) {
      oscillator.stop(start + 1.9);
    }

    return oscillator;
  });

  return { envelope, oscillators, startedAt: start };
}

export function releaseNote(voice: PianoVoice | null) {
  if (!voice || !context) {
    return;
  }

  const now = context.currentTime;
  const gain = voice.envelope.gain;

  // Hold the current level before fading so the release doesn't click.
  if (typeof gain.cancelAndHoldAtTime === "function") {
    gain.cancelAndHoldAtTime(now);
  } else {
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
  }

  gain.setTargetAtTime(
    0.0001,
    Math.max(now, voice.startedAt + 0.02),
    0.12,
  );
  voice.oscillators.forEach((oscillator) => oscillator.stop(now + 0.8));
}
