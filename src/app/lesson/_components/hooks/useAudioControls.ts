import { useAudio } from "react-use";
import { useMemo } from "react";

interface WordData {
  text: string;
  pronunciation: string | null;
  definition: string | null;
  audioSrc: string | null;
}

export const useAudioControls = (sentence: WordData[]) => {
  // Generate audio controls using useMemo to ensure hooks are called consistently
  return useMemo(() => {
    return sentence.map((word) => useAudio({ src: word.audioSrc || "" }));
  }, [sentence]);
};