import React, { useState } from "react";

const SecurityCard = () => {
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <div className="max-w-2xl w-full mx-auto bg-white rounded-xl shadow-md p-4 sm:p-8 mt-6 sm:mt-10 h-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-2">Security</h1>
      <p className="text-gray-500 mb-6 text-sm sm:text-base">
        Manage your account security settings
      </p>
      <button
        className="border border-cyan-500 text-cyan-700 font-medium py-2 px-4 rounded transition hover:bg-violet-50 w-full sm:w-auto block sm:inline-block"
        type="button"
      >
        Change Password
      </button>
      <hr className="my-6" />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-base sm:text-lg">Two-Factor Authentication (2FA)</div>
          <div className="text-gray-500 text-sm mt-1">
            Add an extra layer of security to your account
          </div>
        </div>
        <button
          type="button"
          onClick={() => setTwoFactor((prev) => !prev)}
          className={`relative w-10 h-6 flex items-center ${twoFactor ? "bg-cyan-900" : "bg-gray-300"} rounded-full p-1 transition`}
        >
          <span
            className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
              twoFactor ? "translate-x-4" : ""
            }`}
          ></span>
        </button>
      </div>
      <div className="mt-6 text-gray-500 text-sm">
        Last login:&nbsp;
        <span className="text-cyan-700 underline break-all">Windows in Islamabad</span>
        &nbsp;&bull;&nbsp;2 hours ago
      </div>
    </div>
  );
};

export default SecurityCard;
