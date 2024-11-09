import { useState, useCallback } from "react";
import { useAudio } from "react-use";
import { cn } from "@/lib/utils"; // Utility function for conditional classes

type FlashcardProps = {
  word: string;
  definition: string | null;
  audioSrc: string | null;
};

export const Flashcard = ({ word, definition, audioSrc }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [audio, , controls] = useAudio({ src: audioSrc || "" });

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
    controls.play(); // Play audio on flip
  }, [controls]);

  return (
    <div
      className={cn(
        "relative w-64 h-40 cursor-pointer",
        "perspective-1000",
        "rounded-lg shadow-lg",
        isFlipped ? "flipped" : ""
      )}
      onClick={handleFlip}
    >
      {audio}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center text-center p-4 bg-white rounded-lg transition-transform duration-500",
          "transform-style-preserve-3d",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* Front of the card */}
        <div className="absolute inset-0 flex items-center justify-center backface-hidden">
          <p className="text-lg font-semibold">{word}</p>
        </div>

        {/* Back of the card */}
        <div className="absolute inset-0 flex items-center justify-center backface-hidden rotate-y-180">
          <p className="text-md text-gray-600">{definition}</p>
        </div>
      </div>
    </div>
  );
};
