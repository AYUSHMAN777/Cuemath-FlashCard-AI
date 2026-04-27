import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export type FlashcardRating = "again" | "hard" | "good" | "easy";

type RatingButtonsProps = {
  onRate: (rating: FlashcardRating) => void;
  disabled?: boolean;
};

export function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  const ratingOptions: Array<{
    key: "1" | "2" | "3" | "4";
    rating: FlashcardRating;
    label: string;
    emoji: string;
    className: string;
  }> = [
    { key: "1", rating: "again", label: "Again", emoji: "😵", className: "bg-rose-500 hover:bg-rose-600" },
    { key: "2", rating: "hard", label: "Hard", emoji: "🤔", className: "bg-amber-500 hover:bg-amber-600" },
    { key: "3", rating: "good", label: "Good", emoji: "🙂", className: "bg-sky-500 hover:bg-sky-600" },
    { key: "4", rating: "easy", label: "Easy", emoji: "😎", className: "bg-emerald-500 hover:bg-emerald-600" },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ratingOptions.map((option) => (
        <motion.div key={option.rating} whileTap={{ scale: 0.96 }} whileHover={{ y: -2 }}>
          <Button
            className={`h-12 w-full text-white shadow-sm ${option.className}`}
            onClick={() => onRate(option.rating)}
            disabled={disabled}
          >
            <span className="mr-1">{option.emoji}</span> {option.label}
            <span className="ml-2 rounded-md bg-black/15 px-1.5 py-0.5 text-[10px]">{option.key}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

