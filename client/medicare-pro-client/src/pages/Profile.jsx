import React, { useEffect, useState } from "react";
import axios from "axios";
import SecurityCard from "../cards/SecurityCard";
import UserVarify from "../cards/UserVarify";
import Refer from "../cards/Refer";
import Support from "../cards/Support";
import SubscribeCard from "../cards/Subscribe";
import bgImage from "../assets/bg.png";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import FadeInSection from "../utils/Fade";

const LEFT_PANEL_WIDTH = 320;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState({
    phone: "",
    country: "",
    dob: "",
    gender: "",
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setEditData({
          phone: "",
          country: "",
          dob: "",
          gender: "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
  };

  if (!user)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="text-white text-lg font-semibold">Loading...</div>
      </div>
    );

  return (
    <FadeInSection>
      <div
        className="min-h-screen w-full bg-fixed"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      >
        {/* Left Panel: Fixed on lg+ screens */}
        <div
          className="hidden lg:flex fixed top-0 left-0 h-full flex-col justify-center pl-6 pr-4 z-10"
          style={{
            width: LEFT_PANEL_WIDTH,
            background: "rgba(255,255,255,0.30)",
            minHeight: "100vh",
          }}
        >
          <h1 className="text-3xl xl:text-5xl font-bold mb-4 w-5xl">
            Welcome to Medicare <span className="text-cyan-500">Pro</span>
          </h1>
          <p className="mb-8 text-lg text-gray-700 max-w-2xl">
            We’re excited to have you in our Medicare community! Easily book your appointments, track your health, and enjoy peace of mind with trusted care and support.
          </p>
          <div className="flex space-x-6 mt-2">
            <a href="#" aria-label="Facebook"><FaFacebookF size={28} /></a>
            <a href="#" aria-label="Twitter"><FaTwitter size={28} /></a>
            <a href="#" aria-label="Instagram"><FaInstagram size={28} /></a>
            <a href="#" aria-label="YouTube"><FaYoutube size={28} /></a>
          </div>
        </div>

        {/* Right Panel: scrollable and offset by sidebar on lg+ */}
        <div className="flex-1 flex flex-col items-center w-full min-h-screen py-4 mt-4 lg:mt-0 lg:ml-[320px]">
          <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl bg-white rounded-xl shadow-lg py-8 px-4 sm:px-8 mt-14 mb-10">
            <h1 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Personal Information</h1>
            <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">Update your personal and account information</p>
            <form className="space-y-3 sm:space-y-4" onSubmit={handleSave}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {/* Full Name & Email (read-only) */}
                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">Full Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-100 rounded-md px-4 py-2 text-sm sm:text-base"
                    value={user.name}
                    disabled
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">Email</label>
                  <input
                    type="email"
                    className="w-full bg-gray-100 rounded-md px-4 py-2 text-sm sm:text-base"
                    value={user.email}
                    disabled
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="w-full bg-gray-100 rounded-md px-4 py-2 text-sm sm:text-base"
                    value={editData.phone}
                    onChange={handleChange}
                    disabled={isSaved}
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">Password</label>
                  <input
                    type="text"
                    name="password"
                    className="w-full bg-gray-100 rounded-md px-4 py-2 text-sm sm:text-base"
                    value={editData.country}
                    onChange={handleChange}
                    disabled={isSaved}
                    placeholder="Password"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    className="w-full bg-gray-100 rounded-md px-4 py-2 text-sm sm:text-base"
                    value={editData.dob}
                    onChange={handleChange}
                    disabled={isSaved}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">Gender</label>
                  <select
                    name="gender"
                    className="w-full bg-gray-100 rounded-md px-4 py-2 text-sm sm:text-base"
                    value={editData.gender}
                    onChange={handleChange}
                    disabled={isSaved}
                  >
                    <option value="">Select</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-3 sm:mt-4">
                <button
                  type="submit"
                  className={`bg-cyan-600 text-white py-2 px-4 sm:px-6 rounded-md ${isSaved ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isSaved}
                >
                  {isSaved ? "Saved" : "Save Changes"}
                </button>
              </div>
            </form>
            <div className="mt-6 border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
              <div>
                <span className="block font-medium">Role</span>
                <span className="capitalize">{user.role}</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <SecurityCard />
              <UserVarify />
              <Refer />
              <Support />
              <SubscribeCard />
            </div>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default Profile;
