import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import InsightBox from '../components/InsightBox';
import ValidationDisplay from '../components/ValidationDisplay';
import { getStoredData, saveStoredData } from '../utils/storage';
import { validateLFA } from '../core/rules-engine';

export default function Stakeholders() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ stakeholders: [] });
  const [validation, setValidation] = useState(null);

  useEffect(() => {
    const stored = getStoredData();
    const stakeholders = stored.changeTheory?.stakeholders || [];
    if (stakeholders.length === 0) {
      setFormData({ stakeholders: [{ id: `st-${Date.now()}`, name: '', currentPractice: '', targetPractice: '' }] });
    } else {
      setFormData({
        stakeholders: stakeholders.map(s => ({
          id: s.id,
          name: s.name,
          currentPractice: s.currentState?.practices || '',
          targetPractice: s.desiredChange?.targetPractices || ''
        }))
      });
    }
  }, []);

  const handleFieldChange = (index, field, value) => {
    const updated = { ...formData };
    updated.stakeholders[index][field] = value;
    setFormData(updated);

    const stored = getStoredData();
    stored.changeTheory = stored.changeTheory || { stakeholders: [] };
    stored.changeTheory.stakeholders = updated.stakeholders.map(s => ({
      id: s.id,
      name: s.name,
      currentState: { context: '', practices: s.currentPractice },
      desiredChange: { targetPractices: s.targetPractice }
    }));

    const result = validateLFA(stored);
    setValidation(result);
  };

  const addStakeholder = () => {
    const updated = { ...formData };
    updated.stakeholders.push({
      id: `st-${Date.now()}-${Math.random()}`,
      name: '',
      currentPractice: '',
      targetPractice: ''
    });
    setFormData(updated);
  };

  const removeStakeholder = (index) => {
    const updated = { ...formData };
    updated.stakeholders.splice(index, 1);
    setFormData(updated);

    const stored = getStoredData();
    stored.changeTheory = stored.changeTheory || { stakeholders: [] };
    stored.changeTheory.stakeholders = updated.stakeholders.map(s => ({
      id: s.id,
      name: s.name,
      currentState: { context: '', practices: s.currentPractice },
      desiredChange: { targetPractices: s.targetPractice }
    }));

    const result = validateLFA(stored);
    setValidation(result);
  };

  const handleNext = () => {
    const stored = getStoredData();
    stored.changeTheory = stored.changeTheory || { stakeholders: [] };
    stored.changeTheory.stakeholders = formData.stakeholders.map(s => ({
      id: s.id,
      name: s.name,
      currentState: { context: '', practices: s.currentPractice },
      desiredChange: { targetPractices: s.targetPractice }
    }));

    const result = validateLFA(stored);

    if (result.canProceed && result.summary.errors === 0) {
      saveStoredData(stored);
      navigate('/activities');
    } else {
      setValidation(result);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <ProgressBar currentStep={3} totalSteps={5} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 relative">
          <div className="absolute -left-4 -top-4 text-6xl opacity-10">👥</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mapping Stakeholders</h1>
          <p className="text-lg text-gray-600">
            Who needs to change their practices? Define key stakeholders and the changes they need to make.
          </p>
        </div>

        <InsightBox
          type="info"
          title="💡 Why stakeholders matter"
          message="Real people need to change their practices for your program to succeed. Be specific about current practices and what they need to do differently."
        />

        {validation && <ValidationDisplay validationResult={validation} />}

        <div className="space-y-6 mt-8">
          {formData.stakeholders.map((stakeholder, index) => (
            <div
              key={stakeholder.id}
              className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-green-400 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {stakeholder.name || `Stakeholder ${index + 1}`}
                  </h3>
                </div>
                {formData.stakeholders.length > 1 && (
                  <button
                    onClick={() => removeStakeholder(index)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors"
                  >
                    ✕ Remove
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    👤 Who is this stakeholder? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={stakeholder.name}
                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                    placeholder="e.g., Small-scale farmers, Health workers, Local leaders"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                  <p className="text-xs text-gray-500 mt-2">Be specific. Avoid generic terms like "People" or "Community."</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      📍 Current practices<span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={stakeholder.currentPractice}
                      onChange={(e) => handleFieldChange(index, 'currentPractice', e.target.value)}
                      placeholder="What do they do now? E.g., 'Use flood irrigation which wastes water.'"
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      🎯 Target practices<span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={stakeholder.targetPractice}
                      onChange={(e) => handleFieldChange(index, 'targetPractice', e.target.value)}
                      placeholder="What should they do differently? E.g., 'Adopt drip irrigation systems.'"
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <button
              onClick={addStakeholder}
              className="px-8 py-3 bg-green-50 border-2 border-dashed border-green-400 text-green-700 font-bold rounded-xl hover:bg-green-100 transition-all"
            >
              + Add Another Stakeholder
            </button>
          </div>

          <div className="mt-10 flex justify-between gap-4">
            <button
              onClick={() => navigate('/problem-outcome')}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              ← Back to Problem
            </button>
            <button
              onClick={handleNext}
              disabled={validation?.summary?.errors > 0}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                validation?.summary?.errors > 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:shadow-lg'
              }`}
            >
              Next: Activities →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
