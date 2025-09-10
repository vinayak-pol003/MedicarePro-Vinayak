import React, { useState } from "react";

const SubscribeCard = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // Success/Error message, optional

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
    <div className="max-full mx-auto bg-white  rounded-xl shadow-md p-8 mt-10 w-full">
      <h2 className="text-xl font-bold text-center mb-1">Stay Updated</h2>
      <p className="text-gray-500 text-center mb-6">
        Get the latest medical insights and platform updates
      </p>
      <form
        className="flex items-center justify-center"
        onSubmit={handleSubscribe}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus(""); }}
          placeholder="Enter your email"
          className="bg-gray-100 px-4 py-2 rounded-l-md focus:outline-none w-64"
        />
        <button
          type="submit"
          className="bg-cyan-600 text-white px-6 py-2 rounded-r-md font-semibold hover:bg-cyan-700 transition"
        >
          Subscribe
        </button>
      </form>
      {status && (
        <div className="text-center mt-3 text-cyan-600 font-medium">
          {status}
        </div>
      )}
    </div>
  );
};

export default SubscribeCard;
