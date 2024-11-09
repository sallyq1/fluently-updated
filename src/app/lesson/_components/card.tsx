import Image from "next/image";
import { challenges } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useAudio, useKey } from "react-use";
import { useCallback } from "react";

type Props = {
  id: number;
  imageSrc: string | null;
  audioSrc: string | null;
  text: string;
  shortcut: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
  status?: "correct" | "wrong" | "none";
  type: (typeof challenges.$inferSelect)["type"];
  // New props for drag functionality
  draggableProps?: any;
  dragHandleProps?: any;
  innerRef?: (element: HTMLElement | null) => void;
};

export const Card = ({
  audioSrc,
  id,
  imageSrc,
  onClick,
  shortcut,
  text,
  type,
  disabled,
  selected,
  status,
  draggableProps,
  dragHandleProps,
  innerRef,
}: Props) => {
  const [audio, _, controls] = useAudio({ src: audioSrc || "" });
  const handleClick = useCallback(() => {
    if (disabled) return;
    controls.play();
    onClick();
  }, [disabled, onClick, controls]);

  useKey(shortcut, handleClick, {}, [handleClick]);

  return (
    <div
      ref={innerRef} // Reference for draggable element
      onClick={() => handleClick()}
      {...(type === "DRAG" ? { ...draggableProps, ...dragHandleProps } : {})} // Apply drag props for DRAG type only
      className={cn(
        "h-full rounded-xl border-2 border-b-4 p-4 hover:bg-black/5",
        "cursor-pointer active:border-b-2 lg:p-6",
        selected && "border-[#23AAA7]/70 bg-[#23AAA7]/10 hover:bg-sky-100",
        selected &&
          status === "correct" &&
          "border-green-300 bg-green-100 hover:bg-green-100",
        selected &&
          status === "wrong" &&
          "border-rose-300 bg-rose-100 hover:bg-rose-100",
        disabled && "pointer-events-none hover:bg-white",
        type === "ASSIST" && "w-full lg:p-3",
      )}
    >
      {audio}
      {imageSrc && (
        <div className="relative mb-4 aspect-square max-h-[80px] w-full lg:max-h-[150px]">
          <Image src={imageSrc} fill alt={text} />
        </div>
      )}
      <div
        className={cn(
          "flex items-center justify-between",
          type === "ASSIST" && "flex-row-reverse",
        )}
      >
        {type === "ASSIST" && <div />}
        <p
          className={cn(
            "text-sm text-neutral-600 lg:text-base",
            selected && "text-[#23AAA7]",
            selected && status === "correct" && "text-green-500",
            selected && status === "wrong" && "text-rose-500",
          )}
        >
          {text}
        </p>
        <div
          className={cn(
            "flex w-[20px] items-center justify-center rounded-lg border-2 text-xs",
            "font-semibold text-neutral-400 lg:h-[30px] lg:w-[30px] lg:text-[15px]",
            selected && "border-[#23AAA7]/30 text-[#23AAA7]",
            selected &&
              status === "correct" &&
              "border-green-500 text-green-500",
            selected && status === "wrong" && "border-rose-500 text-rose-500",
          )}
        >
            {shortcut}
        </div>
      </div>
    </div>
  );
};
