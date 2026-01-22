import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import InsightBox from '../components/InsightBox';
import ValidationDisplay from '../components/ValidationDisplay';
import { getStoredData, saveStoredData } from '../utils/storage';
import { validateLFA } from '../core/rules-engine';

export default function Basics() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    programName: '',
    description: ''
  });
  const [validation, setValidation] = useState(null);

  useEffect(() => {
    const stored = getStoredData();
    setFormData({
      programName: stored.program.name,
      description: stored.program.description
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // Real-time validation
    const stored = getStoredData();
    if (name === 'programName') {
      stored.program.name = value;
    } else if (name === 'description') {
      stored.program.description = value;
    }
    const result = validateLFA(stored);
    setValidation(result);
  };

  const handleNext = () => {
    const stored = getStoredData();
    stored.program.name = formData.programName;
    stored.program.description = formData.description;
    const result = validateLFA(stored);

    if (result.canProceed && result.summary.errors === 0) {
      saveStoredData(stored);
      navigate('/problem-outcome');
    } else {
      setValidation(result);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ProgressBar currentStep={1} totalSteps={5} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 relative">
          <div className="absolute -left-4 -top-4 text-6xl opacity-10">📝</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Let's Start with the Basics
          </h1>
          <p className="text-lg text-gray-600">
            Give your program a clear name and description. This is the foundation for everything else.
          </p>
        </div>

        {/* Insight Box */}
        <InsightBox
          type="info"
          title="💡 Why we're asking"
          message="A clear program name and description help ensure alignment throughout your entire program design. Donors will use these to understand your intent."
        />

        {/* Validation Results */}
        {validation && <ValidationDisplay validationResult={validation} />}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg mt-8 p-8 border border-gray-100">
          <div className="space-y-8">
            {/* Program Name */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                📌 Program Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="programName"
                value={formData.programName}
                onChange={handleChange}
                placeholder="e.g., Rural Health Access Initiative"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base"
              />
              <p className="text-xs text-gray-500 mt-2">
                This name will appear in your final framework report
              </p>
            </div>

            {/* Program Description */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                📋 Program Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your program in 2-3 sentences. What do you hope to achieve? Who are you serving?"
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Be specific. Donors use this to understand your intent.
              </p>
            </div>

            {/* Character count for description */}
            <div className="flex justify-between items-center bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
              <span className="text-sm text-gray-600">Characters: <strong>{formData.description.length}</strong></span>
              <span className="text-xs text-blue-600">Good descriptions are 100-300 characters</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              ← Back to Start
            </button>
            <button
              onClick={handleNext}
              disabled={validation?.summary?.errors > 0}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                validation?.summary?.errors > 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-lg'
              }`}
            >
              Next: Problem & Outcome →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
