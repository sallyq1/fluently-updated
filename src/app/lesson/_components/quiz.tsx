"use client";

import {
  challengeOptions,
  challenges,
  lessons,
  userSubscription,
} from "@/db/schema";

import { useState, useTransition } from "react";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { AssistChallenge } from "./assistChallenge";
import { SelectChallenge } from "./selectChallenge";
import { DragChallenge } from "./dragChallenge";
import { Footer } from "./footer";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { toast } from "sonner";
import { useAudio, useWindowSize, useMount } from "react-use";
import Image from "next/image";
import { ResultCard } from "./result-card";
import { usePracticeModal } from "@/store/use-practice-modal";
import { FlashcardChallenge } from "./flashcardChallenge";
import { ExampleChallenge } from "./exampleChallenge";
import { useEffect } from 'react';
import { saveAnalyticsData } from "@/db/queries"; // function in queries to save analytics data


type Props = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  userSubscription:
    | (typeof userSubscription.$inferSelect & {
        isActive: boolean;
      })
    | null;
};

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonChallenges,
  initialLessonId,
  userSubscription,
}: Props) => {
  const { open: openPracticeModal } = usePracticeModal();
  const { width, height } = useWindowSize();
  const router = useRouter();

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }
  });


  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });

  const [isPending, startTransition] = useTransition();
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() =>
    initialPercentage === 100 ? 0 : initialPercentage,
  );
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");
  const [enum_type, setType] = useState<"NORMAL" | "DRAG">("NORMAL");
  const [challenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(
    () => challenges.findIndex((c) => !c.completed) ?? 0,
  );
  const [selectedOption, setSelectedOption] = useState<number>();

  const [dragSentence, setDragSentence] = useState<string[]>([]);

  const [isHidden, setIsHidden] = useState(true)

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];
  const type = challenge?.type;


  //analytics
  const [totalChallengesAttempted, setTotalChallengesAttempted] = useState(0);
  const [totalChallengesCompleted, setTotalChallengesCompleted] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0); // In milliseconds
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [heartsLeft, setHeartsLeft] = useState(initialHearts);

  const [startTime, setStartTime] = useState(Date.now()); // Track time for each challenge

  // Extract correctOrder if this is a DRAG type challenge
  const correctOrder =
    challenge && challenge.type === "DRAG" ? challenge.correctOrder : null;

  console.log(correctOrder);

  const recordChallengeAttempt = (isCorrect:boolean) => {
    setTotalChallengesAttempted((prev) => prev + 1);
    if (isCorrect) {
      setTotalChallengesCompleted((prev) => prev + 1);
      const newScore = 10; // Example scoring logic
      setAverageScore((prev) => {
        const totalAttempts = totalChallengesAttempted + 1;
        return (prev * (totalAttempts - 1) + newScore) / totalAttempts;
      });
    }
  };

  const recordInteraction = () => {
    setTotalInteractions((prev) => prev + 1);
  };

  const recordTimeSpent = () => {
    const endTime = Date.now();
    setTotalTimeSpent((prev) => prev + (endTime - startTime));
    setStartTime(Date.now()); // Reset for next challenge
  };

  const displayAnalyticsData = () => {
      const analyticsData = {
      totalChallengesAttempted,
      totalChallengesCompleted,
      totalTimeSpent,
      totalInteractions,
      averageScore,
      heartsLeft: hearts,
  }

  console.log(analyticsData)

}


 const saveAnalyticsData = async () => {

  const analyticsData = {
    totalChallengesAttempted,
    totalChallengesCompleted,
    totalTimeSpent,
    totalInteractions,
    averageScore,
    heartsLeft: hearts,
}

  try {
    const response = await fetch("/api/save-analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analyticsData }),
    });

    if (!response.ok) {
      throw new Error("Failed to save analytics data");
    }

    console.log("Analytics data saved successfully");
  } catch (error) {
    console.error("Error saving analytics data:", error);
  }
};

  const onSelect = (id: number) => {
    if (status !== "none") return;
    recordInteraction();
    setSelectedOption(id);
  };

  const onNext = () => {
    recordTimeSpent();
    setActiveIndex((current) => current + 1);
    setStatus("none");
    setSelectedOption(undefined);
    setDragSentence([]); 
  };


useEffect(() => {
  console.log("I'm in useEffect, type is ", type);
  if (type === "FLASHCARD" || type === "EXAMPLE" ) {
    setIsHidden(true);
  } else {
    setIsHidden(false);
  }

  if (!challenge)
  {
    initialPercentage = 100;
    console.log("initial percentage set to 100")
  }
}, [type]); // Dependency array ensures this runs whenever `type` changes


  const checkSentence = () => {
    const isCorrect =
      JSON.stringify(dragSentence) === JSON.stringify(correctOrder);
    setStatus(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setPercentage((prev) => prev + 100 / challenges.length);
    } else {

      setHearts((prev) => prev - 1);
      
    }
  };

  const onContinue = () => {
    console.log("on continue was called")
    console.log(type)

    if (type == "DRAG") {
      console.log("type is drag")
      const isCorrect = JSON.stringify(dragSentence) === JSON.stringify(correctOrder);
      setStatus(isCorrect ? "correct" : "wrong");
    
      recordChallengeAttempt(isCorrect);

      if (isCorrect) {
        console.log("Question is right")
            recordChallengeAttempt(isCorrect);
        startTransition(() => {
          upsertChallengeProgress(challenge.id)
            .then((response) => {
              setStatus("correct");
              setPercentage((prev) => prev + 100 / challenges.length);
    
              // Move to the next challenge
              onNext(); // This line ensures it moves to the next challenge
            })
            .catch(() =>
              toast.error("Something went wrong. Please try again."),
            );
        });
      } else {
        console.log("Question is wrong")
        console.log("drag sentence: ", dragSentence)
        console.log("correct order: ", correctOrder)
        startTransition(() => {
          reduceHearts(challenge.id)
            .then((response) => {
             
    
              setStatus("wrong");
    

                setHearts((prev) => prev - 1);
              
            })
            .catch(() =>
              toast.error("Something went wrong. Please try again."),
            );
        });
      }
    }
    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.correct);
    recordChallengeAttempt(!!correctOption);

    if (!correctOption) return;

    if (correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
       

            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);

    
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
      

            setStatus("wrong");

           setHearts((prev) => prev - 1);
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    }
  };

  if (!challenge) {
    saveAnalyticsData(); // Save analytics data if the lesson is completed
    displayAnalyticsData();
    return (
      <div className="flex flex-col space-between h-full">
     
        {finishAudio}
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={1000}
        />
 
        <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
          <Image
            src="/finish.svg"
            alt="finish"
            height={100}
            width={100}
            className="hidden lg:block"
          />
          <Image
            src="/finish.svg"
            alt="finish"
            height={50}
            width={50}
            className="block lg:hidden"
          />
          <h1 className="text-xl font-bold text-neutral-700 lg:text-3xl">
            Great Job! <br /> You&apos;ve completed the lesson.
          </h1>
          <div className="flex w-full items-center gap-x-4">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </div>
        <Footer
          lessonId={initialLessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-32 space-between h-full">
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex h-full flex-1 items-center justify-center">
        {challenge.type === "SELECT" && (
          <SelectChallenge
            question={challenge.question}
            options={options}
            onSelect={onSelect}
            selectedOption={selectedOption}
            status={status}
            disabled={isPending}
            type={challenge.type}
          />
        )}
        {challenge.type === "ASSIST" && (
          <AssistChallenge
            question={challenge.question}
            options={options}
            onSelect={onSelect}
            selectedOption={selectedOption}
            status={status}
            disabled={isPending}
            type={challenge.type}
          />
        )}
       
       
        {challenge.type === "DRAG" && (
          <DragChallenge
            options={options}
            correctOrder={correctOrder}
            status={status}
            setSentence={setDragSentence}
            sentence={dragSentence}
            type={challenge.type}
            disabled={false}
          />
        )}

        {challenge.type === "FLASHCARD" && (
          <FlashcardChallenge
            challengeOptions={challenge.challengeOptions.map((option) => ({
              word: option.text,
              translation: option.translation,
              audioSrc: option.audioSrc,
              imageSrc: option.imageSrc,
            }))}
            onComplete={onNext} // Go to the next challenge
          />
        )}

        {challenge.type === "EXAMPLE" && (
          <ExampleChallenge
            sentence={challenge.challengeOptions.map((option) => ({
              text: option.text,
              pronunciation: option.pronunciation,
              definition: option.translation,
              audioSrc: option.audioSrc,
            }))}
            onComplete={onNext} // Go to the next challenge
          />
        )}
      </div>
      <Footer
        status={status}
        onCheck={onContinue}
        isHidden={isHidden}
      />
    </div>
  );
};
