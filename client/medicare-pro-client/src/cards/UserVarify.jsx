const AccountStatusCard = () => (
  <div className="max-w-2xl w-full mx-auto bg-white rounded-xl shadow-md p-4 sm:p-8 mt-6 sm:mt-10">
    <h1 className="text-xl sm:text-2xl font-bold mb-3">Account Status</h1>
    <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-2">
      <span className="h-3 w-3 rounded-full bg-green-500 inline-block mr-2"></span>
      <span className="font-semibold text-green-700 mr-2 text-base">Verified</span>
      <span className="text-green-700 text-sm sm:text-base">Your account has been verified and is active</span>
    </div>
  </div>
);

export default AccountStatusCard;
