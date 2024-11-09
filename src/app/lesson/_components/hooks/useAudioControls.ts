import { useAudio } from "react-use";

interface WordData {
  text: string;
  pronunciation: string | null;
  definition: string | null;
  audioSrc: string | null;
}

export const useAudioControls = (sentence: WordData[]) => {
  // Return an array of audio elements and controls
  return sentence.map((word) => useAudio({ src: word.audioSrc || "" }));
};
