import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
          <div className="max-w-4xl w-full">
            {/* Logo/Header */}
            <div className="text-center mb-12">
              <div className="text-7xl mb-4 drop-shadow-lg">🧠</div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                ShikshaDesign
              </h1>
              <p className="text-2xl text-gray-600 mb-2">
                Design Programs the Way Experts Think
              </p>
              <p className="text-gray-500">
                Structured thinking. Better outcomes. Real impact.
              </p>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
              {/* Header bar */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <h2 className="text-3xl font-bold text-white">
                  NGO Program Design, Simplified
                </h2>
              </div>

              <div className="p-8 md:p-12">
                {/* The Problem Section */}
                <div className="mb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-100">
                        <span className="text-2xl">⚠️</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">The Problem</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Most NGO programs fail not because of bad intentions, but because:
                        <br />
                        • Problems aren't clearly defined
                        <br />
                        • Outcomes aren't measurable
                        <br />
                        • Activities don't align with outcomes
                        <br />
                        • Stakeholders aren't mapped to practice change
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-8"></div>

                {/* The Solution Section */}
                <div className="mb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100">
                        <span className="text-2xl">✨</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Our Solution</h3>
                      <p className="text-gray-600 leading-relaxed">
                        ShikshaDesign guides you step-by-step through Logical Framework Analysis with:
                        <br />
                        • <strong>Real-time validation</strong> - See errors as you type
                        <br />
                        • <strong>Guided thinking</strong> - Follow expert-designed patterns
                        <br />
                        • <strong>Logical coherence</strong> - Ensure alignment across all levels
                        <br />
                        • <strong>Donor-ready output</strong> - Export your framework instantly
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Features Grid */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">In this demo, you'll:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">Define your program problem</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">Map outcomes to indicators</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">Connect stakeholders</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">Align activities & outputs</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">Auto-generate framework</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">Download your design</span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8 border border-purple-200">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-3xl">⏱️</span>
                    <p className="text-lg font-bold text-gray-900">Takes just 15-20 minutes</p>
                  </div>
                  <p className="text-center text-gray-600">
                    Create a professional, donor-ready logical framework guided by expert thinking
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate('/basics')}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg text-lg"
                  >
                    Start Designing Your Program →
                  </button>
                  <button
                    onClick={() => window.scrollTo(0, document.body.scrollHeight)}
                    className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all text-lg"
                  >
                    Learn More ↓
                  </button>
                </div>

                {/* Trust Message */}
                <p className="text-center text-gray-500 text-sm mt-6 pt-6 border-t border-gray-200">
                  🔒 No login required • 📱 Works on desktop & mobile • 💾 Everything stays on your device
                </p>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Logically Coherent</h3>
                <p className="text-gray-600">
                  Every element aligns with your problem, outcomes, and activities
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Guidance</h3>
                <p className="text-gray-600">
                  Get instant feedback and suggestions as you design
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Output</h3>
                <p className="text-gray-600">
                  Generate donor-ready frameworks with a single click
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>ShikshaDesign © 2026 • Empowering NGOs with Better Program Design</p>
        </div>
      </div>
    </div>
  );
}
