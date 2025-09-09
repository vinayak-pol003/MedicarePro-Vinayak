import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import bgImage from "../assets/bg.png"; // Update path as needed
import FadeInSection from "../utils/Fade";

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <FadeInSection>
        <main
        className="min-h-screen bg-cover bg-center flex items-center justify-center pt-20 pb-8"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="w-full max-w-5xl mx-auto bg-white bg-opacity-90 rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">
          {/* Left Panel */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-8 md:py-12">
            <h1 className="text-5xl font-bold mb-4 text-cyan-700">Contact Us</h1>
            <p className="mb-6 text-gray-700">
             Reach out for support, questions, or partnership inquiries. Our team is committed to helping you with anything you need regarding Medicare Pro services and healthcare solutions. Fill out the form and we’ll get back to you as soon as possible.
            </p>
            <div className="flex space-x-4 mt-2">
              <a href="#"><FaFacebookF size={24} className="text-cyan-600 hover:text-cyan-800 transition" /></a>
              <a href="#"><FaTwitter size={24} className="text-cyan-600 hover:text-cyan-800 transition" /></a>
              <a href="#"><FaInstagram size={24} className="text-cyan-600 hover:text-cyan-800 transition" /></a>
              <a href="#"><FaYoutube size={24} className="text-cyan-600 hover:text-cyan-800 transition" /></a>
            </div>
          </div>
          {/* Contact Section */}
          <section className="w-full md:w-1/2 px-8 py-8 md:py-12">
            <h2 className="text-3xl font-bold text-center text-cyan-600 mb-4">
              Contact Us
            </h2>
            <p className="text-center text-gray-600 mb-8">
              We're here to answer your questions. Reach out to us using the form below or contact details.
            </p>
            <div className="flex flex-col gap-10 md:flex-row">
              {/* Contact Details */}
              <div className="md:w-1/2 flex flex-col gap-6">
                <div>
                  <span className="font-semibold text-gray-800">Address:</span>
                  <p className="text-gray-600">123 Main Street, Mumbai, IN 400001</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Email:</span>
                  <p className="text-gray-600">support@medicarepro.com</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Phone:</span>
                  <p className="text-gray-600">+91 98765-43210</p>
                </div>
              </div>
              {/* Contact Form */}
              <form className="md:w-1/2 flex flex-col gap-4" onSubmit={handleSubmit}>
                <label className="font-medium text-gray-700">
                  Name
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  />
                </label>
                <label className="font-medium text-gray-700">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  />
                </label>
                <label className="font-medium text-gray-700">
                  Message
                  <textarea
                    name="message"
                    rows="4"
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  />
                </label>
                <button
                  type="submit"
                  className="bg-cyan-600 text-white py-2 px-6 rounded font-semibold hover:bg-cyan-700 transition"
                  disabled={submitted}
                >
                  {submitted ? "Thank You!" : "Send Message"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      </FadeInSection>
      
      <Footer />
    </>
  );
};

export default ContactUs;
