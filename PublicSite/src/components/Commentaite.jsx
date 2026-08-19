import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400 text-sm mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

function SourceBadge({ source, dark }) {
  return (
    <span
      className={`text-xs px-2 py-1 rounded-md ${
        dark ? "bg-amber-500/20 text-amber-300" : "bg-gray-100 text-gray-500"
      }`}
    >
      {source}
    </span>
  );
}

export default function Commentaire() {
  const { t } = useLanguage();
  const testimonials = t.testimonials.items;
  const [index, setIndex] = useState(1);
  const total = testimonials.length;
  const prevIndex = (index - 1 + total) % total;
  const nextIndex = (index + 1) % total;
  const [isPaused, setIsPaused] = useState(false);

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  const renderCard = (item, position) => {
    const isActive = position === "active";

    return (
      <div
        className={`rounded-2xl p-8 transition-all duration-300 flex-shrink-0 ${
          isActive
            ? "bg-[#0f1629] w-full md:w-[38%] scale-100 z-10 shadow-xl"
            : "bg-[#f5f1ea] w-full md:w-[30%] opacity-90 hidden md:block"
        }`}
      >
        <Stars />
        <p
          className={`italic text-sm leading-relaxed mb-6 ${
            isActive ? "text-white" : "text-gray-600"
          }`}
        >
          &ldquo;{item.quote}&rdquo;
        </p>
        <div className="flex items-center justify-between">
          <span
            className={`font-semibold text-sm ${
              isActive ? "text-white" : "text-gray-900"
            }`}
          >
            {item.name}
          </span>
          <div className="flex flex-col items-end gap-1">
            <SourceBadge source={item.source} dark={isActive} />
            <span className="text-xs text-gray-400">{item.date}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="bg-[#f5f1ea] py-16 px-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-center gap-4 max-w-6xl mx-auto">
        {renderCard(testimonials[prevIndex], "side")}
        {renderCard(testimonials[index], "active")}
        {renderCard(testimonials[nextIndex], "side")}
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={goPrev}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-white transition-colors"
          aria-label={t.testimonials.prev}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`${t.testimonials.goTo} ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-amber-500" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-white transition-colors"
          aria-label={t.testimonials.next}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
