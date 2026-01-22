import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import InsightBox from '../components/InsightBox';
import ValidationDisplay from '../components/ValidationDisplay';
import { getStoredData, saveStoredData } from '../utils/storage';
import { validateLFA } from '../core/rules-engine';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Input, Textarea, Label } from '../components/ui/Input';

export default function Activities() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ activities: [] });
  const [availableOutcomes, setAvailableOutcomes] = useState([]);
  const [validation, setValidation] = useState(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const stored = getStoredData();
    
    // Load Outcomes for Dropdown
    const outcomes = stored.outcomes || [];
    const options = outcomes.map(o => ({
        id: o.id,
        label: o.statement ? o.statement.substring(0, 100) + (o.statement.length > 100 ? '...' : '') : 'Unnamed Goal'
    }));
    setAvailableOutcomes(options);

    // Load existing activities
    const activities = stored.activities || [];
    if (activities.length === 0) {
      setFormData({
        activities: [
          {
            id: `act-${Date.now()}`,
            activity: '',
            implementer: '',
            timeline: '',
            output: '',
            selectedOutcomeId: options.length > 0 ? options[0].id : ''
          }
        ]
      });
    } else {
      setFormData({
        activities: activities.map(a => ({
          id: a.id,
          activity: a.description,
          implementer: a.implementer || '',
          timeline: a.timeline?.startDate || a.timeline || '',
          output: a.producesOutputs?.[0]?.mechanism || '',
          selectedOutcomeId: a.producesOutputs?.[0]?.outputId ? 
            (stored.outputs?.find(opt => opt.id === a.producesOutputs[0].outputId)?.linksToOutcome?.outcomeId || '') 
            : ''
        }))
      });
    }
  }, []);

  const handleFieldChange = (index, field, value) => {
    setTouched(true);
    const updated = { ...formData };
    updated.activities[index][field] = value;
    setFormData(updated);

    updateStorageAndValidate(updated.activities);
  };

  const updateStorageAndValidate = (currentActivities) => {
     const stored = getStoredData();
     const validActivities = [];
     const impliedOutputs = [];

     currentActivities.forEach(a => {
        const outputId = `output-from-${a.id}`;
        // Default to first outcome if none selected, or user hasn't chosen yet
        const targetOutcomeId = a.selectedOutcomeId || (stored.outcomes?.[0]?.id) || 'out-001';

        validActivities.push({
            id: a.id,
            description: a.activity,
            implementer: a.implementer,
            timeline: { startDate: a.timeline, endDate: a.timeline },
            producesOutputs: a.output ? [{ outputId: outputId, mechanism: a.output }] : []
        });

        if (a.output) {
            impliedOutputs.push({
                id: outputId,
                statement: a.output,
                linksToOutcome: {
                    outcomeId: targetOutcomeId,
                    mechanism: 'Direct Contribution'
                },
                scope: { scale: 1 }
            });
        }
     });

     stored.activities = validActivities;
     stored.outputs = impliedOutputs;

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
      selectedOutcomeId: availableOutcomes.length > 0 ? availableOutcomes[0].id : ''
    });
    setFormData(updated);
    updateStorageAndValidate(updated.activities);
  };

  const removeActivity = (index) => {
    const updated = { ...formData };
    updated.activities.splice(index, 1);
    setFormData(updated);
    updateStorageAndValidate(updated.activities);
  };

  const handleNext = () => {
     // Final save ensures storage is up to date
     updateStorageAndValidate(formData.activities);

    if (formData.activities.length === 0 || !formData.activities[0].activity.trim()) {
        alert("Please describe at least one activity.");
        return;
    }

    navigate('/framework');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <ProgressBar currentStep={4} totalSteps={5} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-10 text-center">
            <div className="inline-block p-3 bg-purple-100 rounded-2xl mb-4">
               <span className="text-4xl">🛠️</span>
            </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Activities & Outputs</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Link your actions directly to the outcomes they support.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
             <div className="md:col-span-2 space-y-6">
                
                {formData.activities.map((activity, index) => (
                    <Card key={activity.id} className="shadow-lg border-purple-100/50 relative overflow-visible">
                         <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500 rounded-l"></div>
                     <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                            {index + 1}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                             Activity {index + 1}
                        </h3>
                        </div>
                        {formData.activities.length > 1 && (
                         <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeActivity(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                            ✕
                        </Button>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div>
                        <Label required>What will you do?</Label>
                        <Textarea
                            value={activity.activity}
                            onChange={(e) => handleFieldChange(index, 'activity', e.target.value)}
                            placeholder="e.g., Conduct 3-day training workshops..."
                            rows={3}
                            className="text-base"
                            error={touched && !activity.activity ? "Required" : null}
                        />
                        </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Who leads this?</Label>
                                <Input
                                    value={activity.implementer}
                                    onChange={(e) => handleFieldChange(index, 'implementer', e.target.value)}
                                    placeholder="e.g., Field Staff"
                                />
                            </div>
                            <div>
                                <Label>When?</Label>
                                <Input
                                    value={activity.timeline}
                                    onChange={(e) => handleFieldChange(index, 'timeline', e.target.value)}
                                    placeholder="e.g., Q1, Month 1"
                                />
                            </div>
                        </div>

                        <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                            <div className="mb-4">
                                <Label required>Produces Output</Label>
                                <Input
                                    value={activity.output}
                                    onChange={(e) => handleFieldChange(index, 'output', e.target.value)}
                                    placeholder="e.g., 50 farmers trained"
                                    className="bg-white border-purple-200"
                                    error={touched && !activity.output ? "Required" : null}
                                />
                            </div>

                            <div>
                                <Label required>Contributes to which Goal?</Label>
                                <select
                                    value={activity.selectedOutcomeId}
                                    onChange={(e) => handleFieldChange(index, 'selectedOutcomeId', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3 border"
                                >
                                    {availableOutcomes.length === 0 && <option value="">No outcomes defined yet</option>}
                                    {availableOutcomes.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Select the specific stakeholder outcome this activity helps achieve.
                                </p>
                            </div>
                        </div>
                    </div>

                    </Card>
                ))}

                 <Button 
                    variant="outline" 
                    className="w-full border-dashed border-2 py-4 text-gray-500 hover:text-purple-600 hover:border-purple-300"
                    onClick={addActivity}
                >
                    + Add Another Activity
                </Button>

                 {/* Navigation Buttons */}
                 <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-gray-100">
                    <Button 
                        variant="secondary" 
                        onClick={() => navigate('/stakeholders')}
                        className="w-full sm:w-auto"
                    >
                        ← Back
                    </Button>
                    <Button 
                        variant="primary" 
                        size="lg"
                        onClick={handleNext}
                        className="w-full sm:w-auto min-w-[160px]"
                    >
                        Review Framework →
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                 <div className="sticky top-8">
                    {validation?.resultsBySeverity?.warning?.length > 0 ? (
                        <InsightBox
                            type="warning"
                            title="Logic Check"
                            message={validation.resultsBySeverity.warning[0].suggestion}
                            highlight={true}
                        />
                    ) : (
                        <InsightBox
                            type="info"
                            title="Logic Helper"
                            message="Connecting specific activities to specific outcomes builds a strong Logic Model. Ensure every activity serves a goal."
                        />
                    )}
                    {validation && <ValidationDisplay validationResult={validation} />}
                </div>
            </div>
          </div>
      </div>
    </div>
  );
}
