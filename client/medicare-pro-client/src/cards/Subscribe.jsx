import React, { useState } from "react";

const SubscribeCard = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // Success/Error message

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setStatus("Please enter your email.");
    } else {
      setStatus("Subscribed!");
      setEmail("");
    }
    // No backend logic, demo only
  };

  return (
    <div className="max-w-2xl w-full mx-auto bg-white rounded-xl shadow-md p-4 sm:p-8 mt-6 sm:mt-10">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-1">Stay Updated</h2>
      <p className="text-gray-500 text-center mb-6 text-sm sm:text-base">
        Get the latest medical insights and platform updates
      </p>
      <form
        className="flex flex-col sm:flex-row items-center justify-center gap-2"
        onSubmit={handleSubscribe}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus(""); }}
          placeholder="Enter your email"
          className="bg-gray-100 px-4 py-2 rounded-md sm:rounded-l-md focus:outline-none w-full sm:w-64 text-sm sm:text-base"
        />
        <button
          type="submit"
          className="bg-cyan-600 text-white px-4 sm:px-6 py-2 rounded-md sm:rounded-r-md font-semibold hover:bg-cyan-700 transition w-full sm:w-auto"
        >
          Subscribe
        </button>
      </form>
      {status && (
        <div className="text-center mt-3 text-cyan-600 font-medium text-sm sm:text-base">
          {status}
        </div>
      )}
    </div>
  );
};

export default SubscribeCard;
