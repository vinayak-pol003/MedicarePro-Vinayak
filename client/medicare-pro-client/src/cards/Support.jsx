import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const faqs = [
  "How can I export my data?",
  "Is KYC verification mandatory?",
  "What are the consultation fees?",
  "How secure is my account?",
];

const SupportFAQsCard = () => {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  // Click handler for Live Chat
  const handleLiveChat = () => {
    navigate("/chat");
  };

  return (
    <div className="max-w-2xl w-full mx-auto mt-6 sm:mt-10 px-2 sm:px-0">
      {/* Support & FAQs section */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-8 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Support & FAQs</h1>
        <p className="text-gray-500 mb-6 text-sm sm:text-base">Find answers to common questions</p>
        <div className="space-y-3 mb-6">
          {faqs.map((question, idx) => (
            <button
              key={idx}
              className="w-full flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition border border-gray-100 px-2 sm:px-4 py-2 sm:py-3 rounded-lg text-left font-medium text-sm sm:text-base"
              onClick={() => setActive(idx === active ? null : idx)}
              type="button"
            >
              <span>{question}</span>
              <span className="text-gray-400">{'>'}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="border border-cyan-500 text-cyan-700 font-medium py-2 px-4 w-full sm:w-auto rounded transition hover:bg-violet-50" type="button">
            Contact Support
          </button>
          <button
            className="bg-cyan-600 text-white font-medium py-2 px-4 w-full sm:w-auto rounded"
            type="button"
            onClick={handleLiveChat}
          >
            Live Chat
          </button>
        </div>
      </div>
      {/* About section */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-2">About Medicare Pro</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Medicare Pro is an all-in-one healthcare platform where patients can manage profiles, book appointments, and access medical information, while providers handle scheduling and prescriptions efficiently.
          It’s secure, easy to use, and designed to make healthcare simple for everyone.
        </p>
      </div>
    </div>
  );
};

export default SupportFAQsCard;
