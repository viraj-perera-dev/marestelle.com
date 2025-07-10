"use client";

import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";

export default function FAQList({ questions }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-8 w-11/12 md:w-1/2 mx-auto pt-20 pb-36">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Cerca una domanda..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 mb-6 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {filteredQuestions.length === 0 ? (
        <p className="text-neutral-600">
          Non ci sono domande relative alla tua ricerca.
        </p>
      ) : (
        filteredQuestions.map((item, index) => (
          <div
            key={index}
            className="faq-item bg-white p-4 mb-4 rounded"
          >
            <button
              className="faq-question w-full text-lg font-semibold text-start text-neutral-800 flex justify-between items-center"
              onClick={() => handleToggle(index)}
            >
              {item.question}
              <FiChevronRight
                className={`transition-transform duration-300 ${
                  openIndex === index ? "rotate-90" : ""
                }`}
              />
            </button>

            {openIndex === index && (
              <div className="faq-answer text-start text-neutral-700 mt-4">
                {item.answer}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
