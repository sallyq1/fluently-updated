import { QuestionBubble } from "./question-bubble";
import { challengeOptions, challenges } from "@/db/schema";
import { Card } from "./card";
import { cn } from "@/lib/utils";


type AssistChallengeProps = {
    question: string;
    options: (typeof challengeOptions.$inferSelect)[];
    onSelect: (id: number) => void;
    status: "correct" | "wrong" | "none";
    selectedOption?: number;
    disabled?: boolean;
    type: (typeof challenges.$inferSelect)["type"];
  };
  

export const AssistChallenge = ({
  question,
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type
}: AssistChallengeProps) => {
  return (
    <div>

<h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">
              Select the Correct Meaning
            </h1>
      <QuestionBubble question={question} />
      <div className={cn("grid gap-2", "grid-cols-1")}>
        {options.map((option, i) => (
          <Card
            key={i}
            id={option.id}
            text={option.text}
            imageSrc={option.imageSrc}
            shortcut={`${i + 1}`}
            selected={selectedOption === option.id}
            onClick={() => onSelect(option.id)}
            status={status}
            audioSrc={option.audioSrc}
            disabled={disabled}
            type="ASSIST"
          />
        ))}
      </div>
    </div>
  );
};

