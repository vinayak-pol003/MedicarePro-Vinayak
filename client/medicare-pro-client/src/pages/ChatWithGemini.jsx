import GeminiChatBox from '../components/GeminiChatBox.jsx';
import bgImage from '../assets/bg.png';

export default function ChatWithGemini() {
  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Left Info Panel (clean, no overlay) */}
      <div className="w-full lg:w-1/2 px-4 sm:px-8 lg:px-16 text-black flex flex-col justify-center items-center lg:items-start mb-8 lg:mb-0">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-center lg:text-left">
          Welcome to Medicare <span className="text-cyan-500">Pro</span>
        </h1>
        <p className="mb-6 text-base sm:text-lg max-w-lg text-gray-800 text-center lg:text-left">
          Seamlessly book and track appointments.<br />
          Your care experience starts here.
        </p>
        {/* Add brief features or tagline here if desired */}
      </div>

      {/* Right GeminiChatBox panel, styled like form card */}
      <div className="w-full max-w-md sm:max-w-xl mx-auto p-1 flex flex-col justify-center items-center">
        <GeminiChatBox />
      </div>
    </div>
  );
}
