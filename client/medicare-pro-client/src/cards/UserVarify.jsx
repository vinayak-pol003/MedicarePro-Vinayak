const AccountStatusCard = () => (
  <div className="max-full mx-auto bg-white rounded-xl shadow-md p-8 mt-10 w-full">
    <h1 className="text-xl font-bold mb-3">Account Status</h1>
    <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center">
      <span className="h-3 w-3 rounded-full bg-green-500 inline-block mr-2"></span>
      <span className="font-semibold text-green-700 mr-2">Verified</span>
      <span className="text-green-700">Your account has been verified and is active</span>
    </div>
  </div>
);

export default AccountStatusCard;
