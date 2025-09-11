import React, { useState } from "react";

export default function GeminiChatBox() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Send input to Gemini backend
  const handleAsk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setReply("");

    try {
      const res = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();
      if (data.reply) {
        setReply(data.reply);
        setInput(""); // Clear box after answer
      } else {
        setError("No reply received.");
      }
    } catch (err) {
      setError("Error connecting to Gemini backend.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-8 flex flex-col items-center mt-8 sm:mt-18">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-cyan-700 text-center tracking-tight">AI Health Chat Support</h2>
      <form
        onSubmit={handleAsk}
        className="w-full flex flex-col items-center"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your question..."
          className="w-full border border-cyan-300 bg-gray-50 px-3 sm:px-5 py-3 sm:py-4 rounded-lg mb-4 sm:mb-6 text-base sm:text-lg focus:outline-none focus:border-cyan-500 transition shadow-sm"
          disabled={loading}
        />
        <button
          className="bg-cyan-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg w-full text-base sm:text-lg font-semibold hover:bg-cyan-700 active:scale-95 transition flex items-center justify-center"
          type="submit"
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <span>
              <span className="loader inline-block mr-2"></span>
              Waiting for reply...
            </span>
          ) : (
            "Ask AI"
          )}
        </button>
      </form>
      {error && (
        <div className="mt-4 sm:mt-6 text-red-600 text-base sm:text-lg w-full text-center border border-red-200 rounded-lg py-2 sm:py-3 bg-red-50 shadow">
          {error}
        </div>
      )}
      {reply && (
        <div
          className="mt-6 sm:mt-8 w-full min-h-[4rem] max-h-[32rem] overflow-auto bg-gray-50 border border-cyan-200 rounded-xl px-3 sm:px-6 py-3 sm:py-6 text-cyan-900 text-base sm:text-lg shadow transition-all duration-300"
          style={{
            height: 'auto',
            whiteSpace: 'pre-line',
          }}
        >
          <strong className="block mb-1 sm:mb-2 text-cyan-700">Ai:</strong>
          {reply.split('\n').map((line, i) =>
            <div key={i} className="mb-1">{line}</div>
          )}
        </div>
      )}
      <style>
        {`
          .loader {
            border: 2px solid #e0e8ff;
            border-top: 2px solid #0ea5e9;
            border-radius: 50%;
            width: 1em;
            height: 1em;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { 0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);} }
        `}
      </style>
    </div>
  );
}
