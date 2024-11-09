import { useState } from "react";
import { useAudio } from "react-use";
import { cn } from "@/lib/utils"; // Utility function for conditional classes
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

type WordData = {
  text: string;
  pronunciation: string | null;
  definition: string | null;
  audioSrc: string | null;
};

type exampleChallengeProps = {
  sentence: WordData[];
  onComplete: () => void;
};

export const ExampleChallenge = ({
  sentence,
  onComplete,
}: exampleChallengeProps) => {
  const [hoveredWord, setHoveredWord] = useState<WordData | null>(null); // Track the word being hovered

  const handleMouseEnter = (word: WordData) => {
    setHoveredWord(word);
  };

  const handleMouseLeave = () => {
    setHoveredWord(null);
  };

    // Generate audio elements and controls for each word at the top level
    const audioControls = sentence.map((word) => useAudio({ src: word.audioSrc || "" }));


  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex flex-wrap gap-2 ">
      {sentence.map((word, index) => {
          const [audio, , controls] = audioControls[index]; // Use pre-generated controls for this word

          return (
            <span
              key={index}
              className="relative cursor-pointer text-blue-500 hover:text-blue-700"
              onMouseEnter={() => handleMouseEnter(word)}
              onMouseLeave={handleMouseLeave}
              onClick={() => controls.play()}
            >
              {audio}
              <h1 className="text-3xl"> {word.text}</h1>
            </span>
          );
        })}

        {/* Tooltip for pronunciation and definition */}
        {hoveredWord && (
          <div
            className="absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-xs -translate-x-1/2 transform rounded bg-gray-800 p-2 text-sm text-white shadow-lg"
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            <p className="font-semibold">{hoveredWord.text}</p>
            <p className="italic">{hoveredWord.pronunciation}</p>
            <p>{hoveredWord.definition}</p>
          </div>
        )}
      </div>
      <Button className="flex items-center space-x-2 mt-4" onClick={onComplete}>
        Next <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
