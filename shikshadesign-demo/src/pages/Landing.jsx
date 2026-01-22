import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
          <div className="max-w-4xl w-full">
            {/* Logo/Header */}
            <div className="text-center mb-12">
              <div className="text-8xl mb-6 drop-shadow-xl filter hover:scale-110 transition-transform cursor-default">🧠</div>
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                Shiksha<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Design</span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-light">
                Design Donor-Ready Social Programs
              </p>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Turn your vision into a funded reality. Build the Logical Frameworks that global donors demand—in minutes, not weeks.
              </p>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 transform hover:-translate-y-1 transition-all duration-300">
              {/* Header bar */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
                  NGO Program Design, Simplified
                </h2>
              </div>

              <div className="p-8 md:p-12">
                {/* The Problem Section */}
                <div className="mb-10 grid md:grid-cols-2 gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-red-100 text-red-600 p-2 rounded-lg text-2xl">⚠️</span>
                            <h3 className="text-xl font-bold text-gray-900">The Challenge</h3>
                        </div>
                         <p className="text-gray-600 leading-relaxed text-lg">
                            Funding is competitive. Donors require rigorous Logical Frameworks (LFAs) to prove your money will make a difference. Complexity often kills good ideas before they start.
                        </p>
                    </div>

                     <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-green-100 text-green-600 p-2 rounded-lg text-2xl">💡</span>
                            <h3 className="text-xl font-bold text-gray-900">The Solution</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg">
                        ShikshaDesign acts as your technical grant writer. It guides you step-by-step, ensuring your problem, outcomes, and activities align perfectly to donor scrutiny.
                      </p>
                    </div>
                </div>

                {/* Features List */}
                 <div className="bg-gray-50 rounded-2xl p-8 mb-10 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center uppercase tracking-wider text-sm text-gray-500">How it works</h3>
                  <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                    {[
                        'Start with the basics', 'Map outcomes to indicators', 'Connect stakeholders',
                        'Align activities & outputs', 'Auto-generate framework', 'Download proposal-ready text'
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">✓</div>
                            <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-10 border border-purple-100 flex items-center justify-center gap-4">
                  <span className="text-3xl">⏱️</span>
                  <div>
                     <p className="text-lg font-bold text-gray-900">Takes just 15-20 minutes</p>
                     <p className="text-gray-600 text-sm">Generate the exact logical evidence funders look for.</p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <Button 
                        onClick={() => navigate('/basics')}
                        size="lg"
                        className="w-full sm:w-auto text-xl py-4 px-10 rounded-full shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                        Start Designing Your Impact (Free) →
                    </Button>
                </div>

                {/* Trust Message */}
                <p className="text-center text-gray-400 text-sm mt-8 pt-6 border-t border-gray-100">
                  🔒 No login required • 📱 Works on desktop & mobile • 💾 Everything stays on your device
                </p>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { icon: '🎯', title: 'Logically Coherent', desc: 'Every element aligns with your problem, outcomes, and activities' },
                    { icon: '⚡', title: 'Real-Time Guidance', desc: 'Get instant feedback and suggestions as you design' },
                    { icon: '📊', title: 'Professional Output', desc: 'Generate donor-ready frameworks with a single click' }
                ].map((item, i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-6 hover:shadow-lg transition">
                        <div className="text-4xl mb-4">{item.icon}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.desc}</p>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
            <h4 className="text-2xl font-bold text-white mb-2">ShikshaDesign</h4>
            <p className="text-gray-500 text-sm mb-6">Empowering NGOs with Better Program Design</p>
          <p className="text-xs text-gray-600">© 2026 ShikshaDesign. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
