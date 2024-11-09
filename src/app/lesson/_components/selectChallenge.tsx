import { Card } from "./card";
import { cn } from "@/lib/utils";
import { challengeOptions, challenges } from "@/db/schema";

type SelectChallengeProps = {
  question: string;
  options: (typeof challengeOptions.$inferSelect)[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: (typeof challenges.$inferSelect)["type"];
};

export const SelectChallenge = ({
  question,
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type,
}: SelectChallengeProps) => {
  return (

    <div className="flex w-full flex-col gap-10 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0 justify-center ">
  <h1 className="text-center text-lg font-bold text-neutral-700  lg:text-3xl w-full">
        {question}
      </h1>
    <div
      className={cn(
        "grid gap-2",
        "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]",
      )}
    >
    
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
          type="SELECT"
        />
      ))}
    </div>
    </div>
  );
};
