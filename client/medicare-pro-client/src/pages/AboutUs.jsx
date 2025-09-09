import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import whoAreWeImg from '../assets/who.png';
import globalMedicalCareImg from '../assets/global.png';
import founderDoctorImg from '../assets/founder.png';
import managerDoctorImg from '../assets/manager.png';
import bgImage from '../assets/who1.png';
import coImg from '../assets/name.png'
import FadeInSection from '../utils/Fade';

const AboutUs = () => (
  <>
    <Navbar />

    <FadeInSection>
        <main className='mt-16'>
      {/* Who We Are Section */}
      <section className="relative w-full min-h-[650px] flex items-start justify-center bg-transparent m-0">
  {/* Background Image with reduced opacity */}
  <img
    src={bgImage}
    alt=""
    className="absolute top-0 left-0 w-full h-full object-cover opacity-70 z-0"
  />
  <div className="relative z-10 max-w-3xl w-full px-6 py-12 fade-in-up">
    <h2 className="text-5xl font-extrabold text-cyan-500 mb-6 drop-shadow-lg text-center">
      Who We Are
    </h2>
    <p className="text-lg text-gray-700 font-medium leading-relaxed text-center">
      Medicare Pro was created with a simple purpose: to make healthcare insurance understandable, accessible, and supportive for everyone.<br /><br />
      We believe that peace of mind should never be complicated or out of reach. Our expert team—spanning medicine, insurance, and technology—stands by each user like a caring guide. We break down every option, answer every question, and walk with you until the coverage you choose truly matches your life.<br /><br />
      We strive to remove barriers and put your needs first, listening with empathy and acting with reliability. Our commitment goes beyond products—it’s about building lasting relationships and empowering your health journey with clear, honest advice.<br /><br />
      Whether you are a family, business, or individual, we ensure you never feel alone in decision-making. Together, we imagine a healthier community—one where care, fairness, and simplicity are at the heart of every plan.
    </p>
  </div>
</section>



      {/* Global Medical Care Section */}
      <section className="bg-white py-14">
  <div className="flex flex-col md:flex-row items-center gap-8 max-w-7xl mx-auto px-4">
    <img
      src={globalMedicalCareImg}
      alt="Global Medical Care"
      className="w-[330px] rounded-lg shadow-lg mb-6 md:mb-0"
    />
    <div>
      <h1 className="text-4xl font-bold text-cyan-500 mb-4">
        Global Medical Care
      </h1>
      <p className="text-xl text-gray-800">
        Our reach extends to global standards, offering care and coverage for individuals and families across borders.
        With a worldwide healthcare network, we ensure seamless support and access whether you’re local or international.
      </p>
    </div>
  </div>
</section>


      {/* Meet Our Leadership Section */}
<section className="bg-[#f7fafc] py-12">
  <h2 className="text-center text-3xl font-semibold mb-10">
    Meet Our <span className="text-cyan-500">Leadership</span>
  </h2>
  <div className="flex flex-col md:flex-row justify-center items-start gap-10 md:gap-16">
    {/* Founder Card */}
    <div className="flex flex-col items-center max-w-md">
      <img
        src={founderDoctorImg}
        alt="Founder Doctor"
        className="w-60 h-80 rounded-xl object-cover mb-6 shadow-md"
      />
      <h4 className="text-xl font-medium mb-1">Dr. Elizabeth Blackwell </h4>
      <p className="font-semibold text-cyan-500 mb-3">Founder</p>
      <p className="text-gray-700 text-center px-1">
        Senior physician and visionary entrepreneur, Dr. Varun is dedicated to advancing patient care through innovative technology and customized health plans. He leads strategy and community outreach at Medicare Pro.
      </p>
    </div>

    {/* Co-Founder Card */}
    <div className="flex flex-col items-center max-w-md">
      <img
        src={coImg}
        alt="Co-Founder Doctor"
        className="w-60 h-80 rounded-xl object-cover mb-6 shadow-md"
      />
      <h4 className="text-xl font-medium mb-1">Dr. Edward Jenne</h4>
      <p className="font-semibold text-cyan-500 mb-3">Co-Founder</p>
      <p className="text-gray-700 text-center px-1">
        With a background in global medicine and healthcare informatics, Dr. Priya brings a passion for digital transformation and international care standards to the team. She drives product innovation and user experience.
      </p>
    </div>

    {/* Product Manager Card */}
    <div className="flex flex-col items-center max-w-md">
      <img
        src={managerDoctorImg}
        alt="Product Manager Doctor"
        className="w-60 h-80 rounded-xl object-cover mb-6 shadow-md"
      />
      <h4 className="text-xl font-medium mb-1">Dr. William Osler</h4>
      <p className="font-semibold text-cyan-500 mb-3">Product Manager</p>
      <p className="text-gray-700 text-center px-1">
        As an expert in clinical operations and healthcare technology, Dr. Vedant oversees policy design and implementation. He ensures every user gets tailored support, combining empathy and advanced analytics.
      </p>
    </div>
  </div>
</section>

      {/* Our Mission Section */}
    <section className="bg-white w-full py-12">
  <h2 className="text-center text-3xl font-bold text-cyan-500 mb-6 w-full">
    Our Mission
  </h2>
  <div className="w-full flex justify-center">
    <p className="text-xl text-gray-800 font-medium leading-relaxed max-w-3xl text-center">
      To deliver accessible, trustworthy healthcare insurance for every need.
      By combining medical expertise and advanced technology, we make every step simple, secure, and personal.
      We are committed to genuine care, privacy, and helping you make informed choices with confidence.
    </p>
  </div>
</section>



      {/* Footer Section */}
      <Footer/>
    </main>

    </FadeInSection>
    
  </>
);

export default AboutUs;
