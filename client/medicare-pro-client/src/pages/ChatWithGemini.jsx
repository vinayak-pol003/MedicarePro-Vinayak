import GeminiChatBox from '../components/GeminiChatBox.jsx';
import bgImage from '../assets/bg.png';

export default function ChatWithGemini() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Left Info Panel (clean, no overlay) */}
      <div className="flex flex-col justify-center w-1/2 px-16 text-black">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Medicare <span className="text-cyan-500">Pro</span>
        </h1>
        <p className="mb-6 text-lg max-w-lg text-gray-800">
          Seamlessly book and track appointments.<br />
          Your care experience starts here.
        </p>
        {/* Add brief features or tagline here if desired */}
      </div>

      {/* Right GeminiChatBox panel, styled like form card */}
      <div className="w-[40rem] max-w-xl mx-auto p-1 flex flex-col justify-center items-center">
        <GeminiChatBox />
      </div>
    </div>
  );
}
