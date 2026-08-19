import { FaPlus, FaMinus } from "react-icons/fa6";
import { useState } from "react";
import { useLanguage } from "../i18n/useLanguage";

export default function FAQ1() {
  const [open, setOpen] = useState(0);
  const { t } = useLanguage();
  const faqs = t.faqPage.faqs;

  const handleClick = (index) => {
    if (open === index) {
      setOpen(null);
    } else {
      setOpen(index);
    }
  };

  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-center text-gray-500">{t.faqPage.intro}</p>

        <div className="mt-16 space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white shadow-lg overflow-hidden duration-300"
            >
              <button
                onClick={() => handleClick(index)}
                className="flex justify-between items-center w-full p-4 text-left"
              >
                <h2 className="text-sm font-semibold">{faq.question}</h2>
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#C4A060] text-white duration-300">
                  {open === index ? <FaMinus /> : <FaPlus />}
                </span>
              </button>

              <div
                className={`overflow-hidden duration-500 ${
                  open === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-8 pb-8 text-sm text-gray-600 leading-8">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
