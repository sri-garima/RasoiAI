"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function RatingPanel() {
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user has already rated
    const hasRated = localStorage.getItem("rasoiai.rating.v1");
    if (!hasRated) {
      // Small delay before showing the rating panel for smooth entry
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  const handleSubmit = () => {
    if (rating > 0) {
      localStorage.setItem("rasoiai.rating.v1", rating.toString());
      setSubmitted(true);
      // Automatically hide after a few seconds
      setTimeout(() => setIsVisible(false), 4000);
    }
  };

  return (
    <div className="mt-10 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8 transition-all duration-500">
      <div className="text-center">
        {submitted ? (
          <div className="py-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className="font-serif text-xl font-semibold text-deep-green">
              Thank you for your feedback!
            </h3>
            <p className="mt-2 text-stone-600">
              We appreciate your help in making Rasoi AI better.
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <h3 className="font-serif text-xl font-semibold text-stone-900">
              How are you liking Rasoi AI?
            </h3>
            <p className="mt-2 text-sm text-stone-500">
              Tap a star to rate your experience.
            </p>

            <div className="mt-5 flex items-center justify-center gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-deep-green focus-visible:ring-offset-2 rounded-full p-1 transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className={cn(
                      "size-8 sm:size-10 transition-colors duration-200",
                      (hovered || rating) >= star
                        ? "fill-orange-accent text-orange-accent"
                        : "text-stone-300 fill-transparent"
                    )}
                  />
                  <span className="sr-only">Rate {star} stars</span>
                </button>
              ))}
            </div>

            {rating > 0 && (
              <div className="mt-5 animate-in slide-in-from-top-2 fade-in duration-300">
                <button
                  onClick={handleSubmit}
                  className="rounded-xl bg-deep-green px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-deep-green/90"
                >
                  Submit Rating
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
