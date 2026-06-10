import * as Speech from "expo-speech";

/**
 * Speak text aloud (Text-to-Speech). Stops any current utterance first so
 * tapping "Listen" again restarts cleanly. Returns a stop() function.
 */
export function speak(
  text: string,
  opts?: { onDone?: () => void; onStart?: () => void },
): () => void {
  Speech.stop();
  Speech.speak(text, {
    rate: 0.92,
    pitch: 1.0,
    onStart: opts?.onStart,
    onDone: opts?.onDone,
    onStopped: opts?.onDone,
    onError: opts?.onDone,
  });
  return () => Speech.stop();
}

export function stopSpeaking() {
  Speech.stop();
}

export async function isSpeaking() {
  return Speech.isSpeakingAsync();
}
