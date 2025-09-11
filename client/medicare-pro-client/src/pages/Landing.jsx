import doctorImg from "../assets/doctor.png";
import partnerMedical1 from "../assets/partner1.png";
import partnerInsurance2 from "../assets/partner2.png";
import partnerHospital3 from "../assets/partner3.png";
import partnerAccreditation4 from "../assets/partner4.png";
import Footer from "../components/Footer";
import Slider from "react-slick";
import LandingTestimonials from "./QALanding";
import FadeInSection from "../utils/Fade";

export default function Landing() {
  return (
    <FadeInSection>
      <div className="min-h-screen bg-gray-50 mt-8 sm:mt-16">
        {/* Hero Section */}
        <section className="flex flex-col items-center px-4 sm:px-6 md:px-20 py-8 sm:py-10 bg-cyan-600">
          <div className="w-full max-w-3xl sm:max-w-5xl flex flex-col md:flex-row items-center gap-6 sm:gap-10">
            {/* Image Side */}
            <div className="flex-1 flex justify-center mb-6 md:mb-0">
              <div className="relative">
                <img
                  src={doctorImg}
                  alt="Doctor"
                  className="w-full max-w-sm sm:max-w-md md:w-[600px] h-[280px] sm:h-[400px] md:h-[500px] object-cover rounded-lg shadow-lg border border-gray-200"
                />
              </div>
            </div>
            {/* Description Side */}
            <div className="flex-1 space-y-4 sm:space-y-6">
              <span className="text-white font-semibold text-base sm:text-lg">We Provide</span>
              <h2 className="text-xl sm:text-4xl md:text-5xl font-bold text-gray-800">
                The Best Medical Healthcare Services
              </h2>
              <p className="text-sm sm:text-base text-white">
                Private GP and medical services — providing comprehensive advice, treatment and care. Book appointments and manage your health in one place.
              </p>
              <div className="flex flex-col sm:flex-row mt-2 sm:mt-4 gap-2">
                <input
                  type="text"
                  placeholder="What services are you looking for?"
                  className="w-full px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
                <button className="bg-white text-gray-700 px-4 py-2 rounded-r-lg hover:bg-cyan-200 transition">
                  Search Here
                </button>
              </div>
              <div className="mt-4 bg-white p-4 shadow rounded-lg w-full sm:w-72">
                <ul className="text-gray-700 space-y-1 text-sm sm:text-base">
                  <li>✔ Get 20% off on your first month</li>
                  <li>✔ Expert doctors</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section className="bg-white py-8 sm:py-12">
          <div className="max-w-3xl sm:max-w-6xl mx-auto">
            <h3 className="text-center text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Healthcare Services
            </h3>
            <p className="text-center text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Private GP and Medical Services – Providing comprehensive advice, treatment and care
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
              {/* Children's Health */}
              <div>
                <div className="mx-auto mb-3 w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full text-yellow-600 text-xl">
                  &#x1F468;&#x200D;&#x1F467;
                </div>
                <h4 className="font-semibold mb-2">Children's Health</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Annual health checks, development checks, immunisations, and management of acute and long-term medical needs.
                </p>
              </div>
              {/* Adolescent Health */}
              <div>
                <div className="mx-auto mb-3 w-10 h-10 flex items-center justify-center bg-pink-100 rounded-full text-pink-600 text-xl">
                  &#x1F9D2;
                </div>
                <h4 className="font-semibold mb-2">Adolescent Health</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Immunisations, puberty, teenage mental wellbeing, youth health concerns.
                </p>
              </div>
              {/* Women's Health */}
              <div>
                <div className="mx-auto mb-3 w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full text-purple-600 text-xl">
                  &#x1F469;&#x200D;&#x1F9AF;
                </div>
                <h4 className="font-semibold mb-2">Women's Health</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Gynecology, cervical screening, menopause management, cancer screening.
                </p>
              </div>
              {/* Men's Health */}
              <div>
                <div className="mx-auto mb-3 w-10 h-10 flex items-center justify-center bg-cyan-100 rounded-full text-cyan-600 text-xl">
                  &#x1F468;&#x200D;&#x2695;&#xFE0F;
                </div>
                <h4 className="font-semibold mb-2">Men's Health</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Screening protocols, prostate health, preventative care.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted Partners */}
        <section className="bg-gray-50 py-6 sm:py-8">
          <div className="max-w-3xl sm:max-w-5xl mx-auto text-center">
            <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4">
              Trusted by Leading Medical Partners
            </h4>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
              <img src={partnerMedical1} alt="Partner 1" className="h-16 w-16 sm:h-40 sm:w-40 object-contain" />
              <img src={partnerInsurance2} alt="Partner 2" className="h-16 w-16 sm:h-40 sm:w-40 object-contain" />
              <img src={partnerHospital3} alt="Partner 3" className="h-16 w-16 sm:h-40 sm:w-40 object-contain" />
              <img src={partnerAccreditation4} alt="Partner 4" className="h-16 w-16 sm:h-40 sm:w-40 object-contain" />
            </div>
          </div>
        </section>

        {/* Patient Testimonials */}
        <LandingTestimonials />

        {/* Appointment Booking CTA */}
        <section className="bg-cyan-50 py-8 sm:py-12">
          <div className="max-w-lg sm:max-w-xl mx-auto text-center">
            <h4 className="text-lg sm:text-2xl font-bold text-cyan-700 mb-2 sm:mb-4">
              Ready to Book Your Appointment?
            </h4>
            <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
              Booking with us is simple and fast. Choose your doctor, pick a suitable time, and get the care you deserve.
            </p>
            <button className="bg-cyan-600 text-white font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow hover:bg-cyan-700 transition text-base sm:text-lg">
              Book Appointment
            </button>
          </div>
        </section>

        {/* FAQ Section Side by Side */}
        <section className="bg-white py-8 sm:py-12">
          <div className="px-2 sm:px-4 md:px-12">
            <h4 className="text-base sm:text-lg font-semibold text-gray-700 text-center mb-6 sm:mb-8">
              Frequently Asked Questions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-6">
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow">
                <div className="font-semibold text-cyan-700 mb-2">
                  How do I book an appointment?
                </div>
                <div className="text-gray-600 text-xs sm:text-sm">
                  Select “Book Appointment,” choose your doctor and time slot, then submit your details. You’ll receive confirmation instantly.
                </div>
              </div>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow">
                <div className="font-semibold text-cyan-700 mb-2">
                  Do you accept health insurance?
                </div>
                <div className="text-gray-600 text-xs sm:text-sm">
                  Yes, we work with major insurance providers. Please check with our team or during booking to confirm your specific plan.
                </div>
              </div>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow">
                <div className="font-semibold text-cyan-700 mb-2">
                  What are your clinic hours?
                </div>
                <div className="text-gray-600 text-xs sm:text-sm">
                  We are open Monday to Saturday from 8:00 AM to 8:00 PM.
                </div>
              </div>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow">
                <div className="font-semibold text-cyan-700 mb-2">
                  Can I walk in without an appointment?
                </div>
                <div className="text-gray-600 text-xs sm:text-sm">
                  Walk-ins are accepted but appointments are preferred for prompt service.
                </div>
              </div>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow">
                <div className="font-semibold text-cyan-700 mb-2">
                  Are telehealth consultations available?
                </div>
                <div className="text-gray-600 text-xs sm:text-sm">
                  Yes, you can book online video or phone consultations with our doctors.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Location Section */}
        <FadeInSection>
          <section className="bg-gray-50 py-8 sm:py-12">
            <div className="max-w-lg sm:max-w-4xl mx-auto">
              <h4 className="text-base sm:text-lg font-semibold text-gray-700 text-center mb-6 sm:mb-8">
                Contact & Location
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Contact Info */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow flex flex-col justify-center">
                  <div className="mb-2 sm:mb-4 text-xs sm:text-base">
                    <span className="font-semibold text-cyan-700">Phone:</span>
                    <span className="text-gray-800 ml-2">+91 98765 43210</span>
                  </div>
                  <div className="mb-2 sm:mb-4 text-xs sm:text-base">
                    <span className="font-semibold text-cyan-700">Email:</span>
                    <span className="text-gray-800 ml-2">info@yourclinic.com</span>
                  </div>
                  <div className="text-xs sm:text-base">
                    <span className="font-semibold text-cyan-700">Hours:</span>
                    <span className="text-gray-800 ml-2">Mon-Sat: 8:00AM – 8:00PM</span>
                  </div>
                </div>
                {/* Location/Map */}
               <div className="bg-white p-4 sm:p-6 rounded-lg shadow flex flex-col justify-center items-center">
      <div className="font-semibold text-cyan-700 mb-2 text-xs sm:text-base">Visit Us:</div>
      <div className="text-gray-800 mb-2 sm:mb-4 text-center text-xs sm:text-base">
        New BEL Rd, M S Ramaiah Nagar, MSRIT Post, Bengaluru, Karnataka 560054, India
      </div>
      <div className="w-full h-24 sm:h-40 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
        <iframe
          title="Google Map"
          width="100%"
          height="100%"
          className="rounded-lg"
          frameBorder="0"
          style={{ border: 0 }}
          src="https://www.google.com/maps?q=New+BEL+Rd,+M+S+Ramaiah+Nagar,+MSRIT+Post,+Bengaluru,+Karnataka+560054,+India&output=embed"
          allowFullScreen
        ></iframe>
      </div>
</div>

              </div>
            </div>
          </section>
        </FadeInSection>

        {/* Footer */}
        <Footer />
      </div>
    </FadeInSection>
  );
}
