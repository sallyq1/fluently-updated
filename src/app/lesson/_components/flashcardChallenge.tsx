"use client"
import { useState, useCallback } from "react";
import { Flashcard } from "./flashcard";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react"; // For the arrow icon
import { useAudio } from "react-use";
import { cn } from "@/lib/utils"; // Utility function for conditional classes
import Image from "next/image";


type FlashcardData = {
    word: string;
    translation: string | null;
    audioSrc: string | null;
    imageSrc: string | null;
  };
  
  type FlashcardChallengeProps = {
    challengeOptions: FlashcardData[];
    onComplete: () => void;
  };
  
  export const FlashcardChallenge = ({
    challengeOptions,
    onComplete,
  }: FlashcardChallengeProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
  
    const currentFlashcard = challengeOptions[currentIndex];
  
    // Setup audio for the current card
    const [audio, , controls] = useAudio({ src: currentFlashcard.audioSrc || "" });
  
    const handleFlip = useCallback(() => {
      setIsFlipped((prev) => !prev);
      controls.play(); // Play audio when the card is flipped
    }, [controls]);
  
    const handleNext = () => {
      if (currentIndex < challengeOptions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false); // Reset flip state for the new card
      } else {
        onComplete(); // Trigger when the last card is reached
      }
    };
  
    return (
      <div className="flex flex-col items-center space-y-4">
        {audio}
  
        {/* Flashcard display with flip animation */}
        <div
          className={cn(
            "relative w-64 h-48 cursor-pointer",
            "perspective-1000",
            "rounded-3xl shadow-lg bg-white text-center flex items-center justify-center h-[500px] w-[500px]",
            "transition-transform duration-500 transform-style-preserve-3d",
            isFlipped ? "rotate-y-180" : ""
          )}
          onClick={handleFlip}
        >
          {/* Front side of the card (Image + Word) */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center backface-hidden",
              isFlipped ? "hidden" : "block"
            )}
          >
            {currentFlashcard.imageSrc && (
              <div className="relative w-50 h-56 mb-2 mt-16">
                <Image src={currentFlashcard.imageSrc} alt={currentFlashcard.word} fill objectFit="contain"  />
              </div>
            )}
            <p className="text-3xl font-semibold w-full h-full items-center mt-16 text-center">{currentFlashcard.word}</p>
          </div>
  
          {/* Back side of the card (Translation) */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center backface-hidden rotate-y-180",
              isFlipped ? "block" : "hidden"
            )}
          >
            <h1 className="text-md text-gray-600 flex "><span className="w-full h-full items-center text-4xl font-bold mt-56 text-center">{currentFlashcard.translation}</span></h1>
          </div>
        </div>
  
        {/* Navigation Button */}
        <Button
          className="flex items-center space-x-2 mt-4"
          onClick={handleNext}
        >
          <span>{currentIndex < challengeOptions.length - 1 ? "Next" : "Continue"}</span>
          {currentIndex < challengeOptions.length - 1 ? (
            <ChevronRight className="w-5 h-5" />
          ) : null}
        </Button>
      </div>
    );
  };