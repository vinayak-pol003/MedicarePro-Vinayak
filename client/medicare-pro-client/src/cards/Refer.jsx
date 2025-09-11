import React from "react";

const ReferFriendCard = () => {
  const referralCode = "BULLSN1234";
  const referralLink = "https://bullsnbear.com/ref/BULLSN1234";

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-2xl w-full mx-auto bg-white rounded-xl shadow-md p-4 sm:p-8 mt-8 sm:mt-16 h-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-2">Refer a Friend</h1>
      <p className="text-gray-500 mb-6 text-sm sm:text-base">
        Share your referral code and earn rewards when friends join
      </p>
      <div className="mb-4">
        <div className="font-medium mb-1 text-sm sm:text-base">Referral Code</div>
        <div className="relative">
          <input
            type="text"
            value={referralCode}
            disabled
            className="w-full bg-gray-100 rounded-md px-2 sm:px-4 py-2 pr-10 text-sm sm:text-base"
          />
          <button
            type="button"
            className="absolute top-1/2 right-2 -translate-y-1/2 p-2"
            onClick={() => handleCopy(referralCode)}
            title="Copy"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <rect x="7" y="7" width="10" height="14" rx="2" fill="none" />
              <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mb-4">
        <div className="font-medium mb-1 text-sm sm:text-base">Referral Link</div>
        <div className="relative">
          <input
            type="text"
            value={referralLink}
            disabled
            className="w-full bg-gray-100 rounded-md px-2 sm:px-4 py-2 pr-10 text-sm sm:text-base"
          />
          <button
            type="button"
            className="absolute top-1/2 right-2 -translate-y-1/2 p-2"
            onClick={() => handleCopy(referralLink)}
            title="Copy"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <rect x="7" y="7" width="10" height="14" rx="2" fill="none" />
              <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
      <hr className="my-6" />
      <div>
        <span className="font-semibold text-base sm:text-lg">5 successful referrals</span>
        <div className="text-gray-600 text-sm mb-4">
          You've earned 250 bonus points
        </div>
        <button
          type="button"
          className="bg-cyan-600 text-white py-2 px-4 sm:px-6 rounded-md w-full sm:w-auto block sm:float-right"
        >
          Invite Friends
        </button>
      </div>
    </div>
  );
};

export default ReferFriendCard;
