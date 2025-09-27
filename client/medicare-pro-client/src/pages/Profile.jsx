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
import toast from "react-hot-toast";

const LEFT_PANEL_WIDTH = 320;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gender: "",
  });
  const [originalData, setOriginalData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        
        // Initialize edit data with current user data
        const userData = {
          name: res.data.name || "",
          email: res.data.email || "",
          password: "", // Don't prefill password
          phone: res.data.phone || "",
          dob: res.data.dob || "",
          gender: res.data.gender || "",
        };
        setEditData(userData);
        
        // Store original data for comparison
        setOriginalData({
          name: res.data.name || "",
          email: res.data.email || "",
          password: "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
        toast.error("Failed to load profile data");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset to original values
    setEditData({
      name: originalData.name,
      email: originalData.email,
      password: "",
      phone: editData.phone, // Keep local state values for non-DB fields
      dob: editData.dob,
      gender: editData.gender,
    });
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      // Prepare data for database update (only name, email, password)
      const dbUpdateData = {};
      
      // Only include fields that have changed
      if (editData.name !== originalData.name) {
        dbUpdateData.name = editData.name;
      }
      if (editData.email !== originalData.email) {
        dbUpdateData.email = editData.email;
      }
      if (editData.password.trim() !== "") {
        dbUpdateData.password = editData.password;
      }

      // Update database only if there are changes to DB fields
      if (Object.keys(dbUpdateData).length > 0) {
        const response = await axios.put("http://localhost:5000/api/profile", dbUpdateData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update user state with response data
        setUser(prev => ({
          ...prev,
          ...response.data,
        }));

        // Update original data for future comparisons
        setOriginalData({
          name: response.data.name || editData.name,
          email: response.data.email || editData.email,
          password: "",
        });

        toast.success("Profile updated successfully!");
      }

      // Clear password field after save
      setEditData(prev => ({
        ...prev,
        password: "",
      }));

      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile", err);
      const errorMessage = err.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
            We're excited to have you in our Medicare community! Easily book your appointments, track your health, and enjoy peace of mind with trusted care and support.
          </p>
          <div className="flex space-x-6 mt-2">
            <a href="#" aria-label="Facebook"><FaFacebookF size={28} /></a>
            <a href="#" aria-label="Twitter"><FaTwitter size={28} /></a>
            <a href="#" aria-label="Instagram"><FaInstagram size={28} /></a>
            <a href="#" aria-label="YouTube"><FaYoutube size={28} /></a>
          </div>
        </div>

        {/* Right Panel: scrollable and offset by sidebar on lg+ */}
        <div className="flex-1 flex flex-col items-center w-full min-h-screen py-4 mt-9 sm:mt-9 lg:ml-[320px]">
          <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl bg-white rounded-xl shadow-lg py-8 px-4 sm:px-8 mt-14 mb-10">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Personal Information</h1>
                <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">Update your personal and account information</p>
              </div>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 transition-colors text-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form className="space-y-3 sm:space-y-4" onSubmit={handleSave}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {/* Full Name */}
                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">
                    Full Name
                    {isEditing && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`w-full rounded-md px-4 py-2 text-sm sm:text-base ${
                      isEditing 
                        ? "border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                        : "bg-gray-100"
                    }`}
                    value={editData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required={isEditing}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">
                    Email
                    {isEditing && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`w-full rounded-md px-4 py-2 text-sm sm:text-base ${
                      isEditing 
                        ? "border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                        : "bg-gray-100"
                    }`}
                    value={editData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required={isEditing}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className={`w-full rounded-md px-4 py-2 text-sm sm:text-base ${
                      isEditing 
                        ? "border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                        : "bg-gray-100"
                    }`}
                    value={editData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="+1 234 567 890"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">
                    {isEditing ? "New Password" : "Password"}
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
                        value={editData.password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? "👁️" : "🔒"}
                      </button>
                    </div>
                  ) : (
                    <input
                      type="password"
                      className="w-full bg-gray-100 rounded-md px-4 py-2 text-sm sm:text-base"
                      value="••••••••"
                      disabled
                    />
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    className={`w-full rounded-md px-4 py-2 text-sm sm:text-base ${
                      isEditing 
                        ? "border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                        : "bg-gray-100"
                    }`}
                    value={editData.dob}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">Gender</label>
                  <select
                    name="gender"
                    className={`w-full rounded-md px-4 py-2 text-sm sm:text-base ${
                      isEditing 
                        ? "border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                        : "bg-gray-100"
                    }`}
                    value={editData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    <option value="">Select</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-white py-2 px-4 sm:px-6 rounded-md hover:bg-gray-600 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-cyan-600 text-white py-2 px-4 sm:px-6 rounded-md hover:bg-cyan-700 transition-colors disabled:bg-gray-400"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>

            {/* Role Information */}
            <div className="mt-6 border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
              <div>
                <span className="block font-medium">Role</span>
                <span className="capitalize">{user.role}</span>
              </div>
              {editData.phone && !isEditing && (
                <div>
                  <span className="block font-medium">Phone</span>
                  <span>{editData.phone}</span>
                </div>
              )}
            </div>

            {/* Patient-only Cards */}
            {user.role === "patient" && (
              <div className="flex flex-col gap-4 mt-4">
                <UserVarify />
                <Refer />
                <Support />
                <SubscribeCard />
              </div>
            )}
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default Profile;
