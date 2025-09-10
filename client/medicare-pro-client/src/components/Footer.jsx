import facebookLogo from "../assets/facebook.png";
import twitterLogo from "../assets/twitter.png";
import instagramLogo from "../assets/insta.png";

export default function Footer() {
  return (
    <footer className="bg-cyan-600 text-white pt-10 pb-0 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-0 justify-between w-full">
        {/* Logo and Social */}
        <div className="md:w-1/4 w-full flex flex-col items-start mb-8 md:mb-0">
          <div className="flex items-center mb-4">
            {/* Char Logo */}
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-cyan-600 text-white font-bold text-lg mr-2">
              M
            </span>
            <span className="font-bold text-white text-lg">Medicare Pro</span>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <span className="bg-cyan-900 rounded-full p-2 flex items-center justify-center">
              <img src={facebookLogo} alt="Facebook" className="h-6 w-6" />
            </span>
            <span className="bg-cyan-900 rounded-full p-2 flex items-center justify-center">
              <img src={twitterLogo} alt="Twitter" className="h-6 w-6" />
            </span>
            <span className="bg-cyan-900 rounded-full p-2 flex items-center justify-center">
              <img src={instagramLogo} alt="Instagram" className="h-6 w-6" />
            </span>
          </div>
          <div className="text-sm text-cyan-200 mb-2">
            TTY/TDD telephones (Relay No. 711)
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="md:w-3/4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-cyan-50 text-sm">
          <div>
            <h5 className="font-bold text-white mb-2">Connect With Us</h5>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Community Relations</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">Newsletter</a></li>
              <li><a href="#" className="hover:underline">Suppliers</a></li>
              <li><a href="#" className="hover:underline">Volunteer</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-2">About Us</h5>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">About Clinic</a></li>
              <li><a href="#" className="hover:underline">Community Health</a></li>
              <li><a href="#" className="hover:underline">Newsroom</a></li>
              <li><a href="#" className="hover:underline">Foundation</a></li>
              <li><a href="#" className="hover:underline">Social Stewardship</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-2">For Patients</h5>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Billing & Insurance</a></li>
              <li><a href="#" className="hover:underline">Pre-registration</a></li>
              <li><a href="#" className="hover:underline">Virtual Health</a></li>
              <li><a href="#" className="hover:underline">Patient Groups</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-2">For Providers</h5>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Education</a></li>
              <li><a href="#" className="hover:underline">Medical Professionals</a></li>
              <li><a href="#" className="hover:underline">Research Institute</a></li>
              <li><a href="#" className="hover:underline">Referring Providers</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider and Copyright */}
      <div className="border-t border-cyan-500 my-6" />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 pb-6 w-full">
        <span className="text-cyan-100 text-xs mb-2 md:mb-0">
          ©2015–{new Date().getFullYear()} ALL RIGHTS RESERVED.
        </span>
        <div className="space-x-4 sm:space-x-6 text-cyan-200 text-xs flex flex-wrap justify-center md:justify-end w-full md:w-auto">
          <a href="#" className="hover:underline">Price Transparency</a>
          <a href="#" className="hover:underline">Patient Rights and Privacy</a>
          <a href="#" className="hover:underline">Notices and Policies</a>
          <a href="#" className="hover:underline">Terms and Conditions</a>
        </div>
      </div>
    </footer>
  );
}
