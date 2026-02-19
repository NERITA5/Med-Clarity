export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl font-extrabold text-slate-900 mb-4">
        Understand your <span className="text-[#0FB9B1]">Health</span>
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mb-8">
        Upload your lab results and get clear, AI-powered explanations in seconds. 
        Safe, private, and easy to understand.
      </p>
      <div className="flex gap-4">
        <a href="/sign-up" className="px-8 py-3 bg-[#0FB9B1] text-white font-semibold rounded-full shadow-lg hover:shadow-teal-200 transition-all">
          Get Started for Free
        </a>
      </div>
    </div>
  );
}