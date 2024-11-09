import { useState } from "react";
import { cn } from "@/lib/utils";
import { challengeOptions, challenges } from "@/db/schema";


type Option = {
  id: number;
  text: string;
};

type DragChallengeProps = {
  options: Option[]; // Words in the word bank
  correctOrder: string[] | null; // Correct sentence order
  status: "correct" | "wrong" | "none";
  setSentence: (sentence: string[]) => void; // Function to update the sentence
  sentence: string[]; // Current sentence state
  type: (typeof challenges.$inferSelect)["type"];
  disabled?: boolean;
};

export const DragChallenge = ({
  options,
  correctOrder,
  status,
  setSentence,
  sentence,
  type, 
  disabled
}: DragChallengeProps) => {
  const [wordBank, setWordBank] = useState<Option[]>(options); // Words in the bank

  // Function to add a word to the sentence
  const addWordToSentence = (option: Option) => {
    setWordBank((prevBank) => prevBank.filter((word) => word.id !== option.id));
    setSentence([...sentence, option.text]); // Add to sentence
  };

  // Function to remove a word from the sentence back to the word bank
  const removeWordFromSentence = (text: string) => {
    setSentence(sentence.filter((word) => word !== text));
    const removedOption = options.find((option) => option.text === text);
    if (removedOption) setWordBank([...wordBank, removedOption]);
  };

  return (
    
    <div className="p-4 space-y-4 bg-gray-50 rounded-lg">
        <h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">
              Click to order the words correctly
            </h1>
      {/* Word Bank */}
      <div className="p-4 border rounded-lg bg-white shadow-md">
        <h3 className="mb-2 text-lg font-semibold">Word Bank</h3>
        <div className="flex flex-wrap gap-2">
          {wordBank.map((option) => (
            <button
              key={option.id}
              onClick={() => addWordToSentence(option)}
              className="p-2 border rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      {/* Sentence Area */}
      <div className="p-4 border rounded-lg bg-white shadow-md">
        <h3 className="mb-2 text-lg font-semibold">Build Your Sentence</h3>
        <div className="flex gap-2 flex-wrap min-h-[40px]">
          {sentence.map((text, index) => (
            <button
              key={index}
              onClick={() => removeWordFromSentence(text)}
              className={cn(
                "p-2 border rounded-lg",
                status === "correct" ? "bg-green-100 border-green-300" :
                status === "wrong" ? "bg-red-100 border-red-300" : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      {/* Status Message */}
      {status !== "none" && (
        <div className={cn(
          "p-4 text-center font-semibold rounded-lg",
          status === "correct" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
        )}>
          {status === "correct" ? "Correct!" : "Try Again"}
        </div>
      )}
    </div>
  );
};

