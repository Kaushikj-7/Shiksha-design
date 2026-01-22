import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import InsightBox from '../components/InsightBox';
import ValidationDisplay from '../components/ValidationDisplay';
import { getStoredData, saveStoredData } from '../utils/storage';
import { validateLFA } from '../core/rules-engine';

export default function Activities() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    activities: []
  });
  const [validation, setValidation] = useState(null);

  useEffect(() => {
    const stored = getStoredData();
    // Load existing activities
    const activities = stored.activities || [];
    if (activities.length === 0) {
      // Start with empty activity
      setFormData({
        activities: [
          {
            id: `act-${Date.now()}`,
            activity: '',
            implementer: '',
            timeline: '',
            output: '',
            linkedOutcome: ''
          }
        ]
      });
    } else {
      setFormData({
        activities: activities.map(a => ({
          id: a.id,
          activity: a.description,
          implementer: a.implementer || '',
          timeline: a.timeline || '',
          output: a.producesOutputs?.[0]?.mechanism || '',
          linkedOutcome: a.producesOutputs?.[0]?.outputId || ''
        }))
      });
    }
  }, []);

  const handleFieldChange = (index, field, value) => {
    const updated = { ...formData };
    updated.activities[index][field] = value;
    setFormData(updated);

    // Real-time validation
    const stored = getStoredData();
    stored.activities = updated.activities.map(a => ({
      id: a.id,
      description: a.activity,
      implementer: a.implementer,
      budget: 0,
      timeline: a.timeline,
      producesOutputs: a.output ? [{ outputId: a.linkedOutcome, mechanism: a.output }] : []
    }));

    const result = validateLFA(stored);
    setValidation(result);
  };

  const addActivity = () => {
    const updated = { ...formData };
    updated.activities.push({
      id: `act-${Date.now()}-${Math.random()}`,
      activity: '',
      implementer: '',
      timeline: '',
      output: '',
      linkedOutcome: ''
    });
    setFormData(updated);
  };

  const removeActivity = (index) => {
    const updated = { ...formData };
    updated.activities.splice(index, 1);
    setFormData(updated);

    // Revalidate
    const stored = getStoredData();
    stored.activities = updated.activities.map(a => ({
      id: a.id,
      description: a.activity,
      implementer: a.implementer,
      budget: 0,
      timeline: a.timeline,
      producesOutputs: a.output ? [{ outputId: a.linkedOutcome, mechanism: a.output }] : []
    }));

    const result = validateLFA(stored);
    setValidation(result);
  };

  const handleNext = () => {
    const stored = getStoredData();
    stored.activities = formData.activities.map(a => ({
      id: a.id,
      description: a.activity,
      implementer: a.implementer,
      budget: 0,
      timeline: a.timeline,
      producesOutputs: a.output ? [{ outputId: a.linkedOutcome, mechanism: a.output }] : []
    }));

    const result = validateLFA(stored);

    if (result.canProceed && result.summary.errors === 0) {
      saveStoredData(stored);
      navigate('/framework');
    } else {
      setValidation(result);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressBar currentStep={4} totalSteps={5} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            What Will You Do?
          </h1>
          <p className="text-gray-600">
            Define activities and the outputs they produce. Each activity should directly support your outcome.
          </p>
        </div>

        {/* Insight Box */}
        <InsightBox
          type="info"
          title="Activity → Output → Outcome"
          message="Each activity produces an output. That output is how your activity contributes to the desired outcome. Be clear about what gets delivered and how it supports change."
        />

        {/* Validation Results */}
        {validation && <ValidationDisplay validationResult={validation} />}

        {/* Form */}
        <div className="bg-white rounded-lg shadow mt-8 p-8">
          <div className="space-y-6">
            {/* Activities List */}
            {formData.activities.map((activity, index) => (
              <div
                key={activity.id}
                className="border border-gray-300 rounded-lg p-6 bg-white hover:border-blue-400 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Activity {index + 1}
                  </h3>
                  {formData.activities.length > 1 && (
                    <button
                      onClick={() => removeActivity(index)}
                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Activity Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      What activity will you implement?{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={activity.activity}
                      onChange={(e) =>
                        handleFieldChange(index, 'activity', e.target.value)
                      }
                      placeholder="e.g., 'Train 200 farmers on drip irrigation installation and maintenance'"
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tip: Include who, what, how many, and when.
                    </p>
                  </div>

                  {/* Implementer */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Who will implement this?
                    </label>
                    <input
                      type="text"
                      value={activity.implementer}
                      onChange={(e) =>
                        handleFieldChange(index, 'implementer', e.target.value)
                      }
                      placeholder="e.g., 'Program staff, Partners, Community members'"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Timeline
                    </label>
                    <input
                      type="text"
                      value={activity.timeline}
                      onChange={(e) =>
                        handleFieldChange(index, 'timeline', e.target.value)
                      }
                      placeholder="e.g., '6 months', '2025 Q1-Q2'"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Output */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      What is the output? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={activity.output}
                      onChange={(e) =>
                        handleFieldChange(index, 'output', e.target.value)
                      }
                      placeholder="E.g., '200 farmers trained and equipped with drip irrigation knowledge and tools'"
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Outputs are deliverables: Who learns what? What gets built? What service is provided?
                    </p>
                  </div>

                  {/* Linked Outcome */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      How does this output support the outcome?{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={activity.linkedOutcome}
                      onChange={(e) =>
                        handleFieldChange(index, 'linkedOutcome', e.target.value)
                      }
                      placeholder="E.g., 'Trained farmers can adopt drip irrigation, which increases yield and income (outcome).'"
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Explain the logic: How does delivering this output lead to the outcome?
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Activity Button */}
            <button
              onClick={addActivity}
              className="w-full px-6 py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 font-semibold hover:border-blue-600 hover:bg-blue-50 transition-colors"
            >
              + Add Another Activity
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => navigate('/stakeholders')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={validation?.summary?.errors > 0}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
            >
              Next: Framework →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
