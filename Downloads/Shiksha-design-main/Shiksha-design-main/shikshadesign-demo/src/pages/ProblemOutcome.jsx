import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import InsightBox from '../components/InsightBox';
import ValidationDisplay from '../components/ValidationDisplay';
import { getStoredData, saveStoredData } from '../utils/storage';
import { validateLFA } from '../core/rules-engine';

export default function ProblemOutcome() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    problem: '',
    outcome: '',
    indicator: ''
  });
  const [validation, setValidation] = useState(null);

  useEffect(() => {
    const stored = getStoredData();
    setFormData({
      problem: stored.problemContext.problem,
      outcome: stored.outcomes[0]?.statement || '',
      indicator: stored.outcomes[0]?.indicators[0]?.name || ''
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // Real-time validation
    const stored = getStoredData();
    stored.problemContext.problem = updated.problem;
    if (!stored.outcomes[0]) {
      stored.outcomes[0] = { id: 'out-001', statement: '', indicators: [], scope: [] };
    }
    stored.outcomes[0].statement = updated.outcome;
    if (!stored.outcomes[0].indicators[0]) {
      stored.outcomes[0].indicators[0] = { id: 'ind-001', name: '' };
    }
    stored.outcomes[0].indicators[0].name = updated.indicator;
    
    const result = validateLFA(stored);
    setValidation(result);
  };

  const handleNext = () => {
    const stored = getStoredData();
    stored.problemContext.problem = formData.problem;
    if (!stored.outcomes[0]) {
      stored.outcomes[0] = { id: 'out-001', statement: '', indicators: [], scope: [] };
    }
    stored.outcomes[0].statement = formData.outcome;
    if (!stored.outcomes[0].indicators[0]) {
      stored.outcomes[0].indicators[0] = { id: 'ind-001', name: '' };
    }
    stored.outcomes[0].indicators[0].name = formData.indicator;

    const result = validateLFA(stored);

    if (result.canProceed && result.summary.errors === 0) {
      saveStoredData(stored);
      navigate('/stakeholders');
    } else {
      setValidation(result);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <ProgressBar currentStep={2} totalSteps={5} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 relative">
          <div className="absolute -left-4 -top-4 text-6xl opacity-10">🎯</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Problem to Outcome: The Logic
          </h1>
          <p className="text-lg text-gray-600">
            Define the problem you're addressing and the change you want to see. This is your program's core logic.
          </p>
        </div>

        {/* Insight Boxes */}
        <div className="space-y-4 mb-8">
          <InsightBox
            type="info"
            title="💡 The Logic Chain"
            message="Problem → You want to solve this → Outcome describes the desired change → Indicator proves it happened"
          />
          {validation && <ValidationDisplay validationResult={validation} />}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="space-y-8">
            {/* Problem Definition */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                ⚠️ What is the core problem? <span className="text-red-500">*</span>
              </label>
              <textarea
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                placeholder="Be specific. E.g., 'Farmers lack access to modern irrigation techniques, leading to low yields and income instability.'"
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: State the problem, not your solution. Include root causes.
              </p>
            </div>

            {/* Desired Outcome */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                🎯 What outcome do you want? <span className="text-red-500">*</span>
              </label>
              <textarea
                name="outcome"
                value={formData.outcome}
                onChange={handleChange}
                placeholder="E.g., 'Farmers increase agricultural yields and income through improved irrigation practices.'"
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Be ambitious but realistic. Focus on the desired change.
              </p>
            </div>

            {/* Measurable Indicator */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                📊 How will you know it worked? <span className="text-red-500">*</span>
              </label>
              <textarea
                name="indicator"
                value={formData.indicator}
                onChange={handleChange}
                placeholder="E.g., '80% of participating farmers report 25% increase in crop yield within 18 months.'"
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Include numbers, timeframes, and populations. Make it measurable.
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between gap-4">
            <button
              onClick={() => navigate('/basics')}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              ← Back to Basics
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
              Next: Stakeholders →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
