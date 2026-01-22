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

export default function Stakeholders() {
  const navigate = useNavigate();
  // New Data Structure: Stakeholder -> [Change(Current, Target, Indicator)]
  const [formData, setFormData] = useState({ stakeholders: [] });
  const [validation, setValidation] = useState(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const stored = getStoredData();
    // Try to load detailed structure first
    if (stored.detailedStakeholders && stored.detailedStakeholders.length > 0) {
        setFormData({ stakeholders: stored.detailedStakeholders });
    } 
    // Fallback to legacy structure
    else if (stored.changeTheory?.stakeholders) {
      setFormData({
        stakeholders: stored.changeTheory.stakeholders.map(s => ({
          id: s.id,
          name: s.name,
          description: '', 
          changes: [{ 
              id: `ch-${Date.now()}-${Math.random()}`, 
              current: s.currentState?.practices || '', 
              target: s.desiredChange?.targetPractices || '',
              indicator: '' 
          }]
        }))
      });
    } else {
        // Init empty
        setFormData({ stakeholders: [createEmptyStakeholder()] });
    }
  }, []);

  const createEmptyStakeholder = () => ({
      id: `st-${Date.now()}-${Math.random()}`,
      name: '',
      description: '',
      changes: [{
          id: `ch-${Date.now()}-${Math.random()}`,
          current: '',
          target: '',
          indicator: ''
      }]
  });

  const createEmptyChange = () => ({
      id: `ch-${Date.now()}-${Math.random()}`,
      current: '',
      target: '',
      indicator: ''
  });

  const updateStateAndStorage = (newStakeholders) => {
    setFormData({ stakeholders: newStakeholders });

    const stored = getStoredData();
    
    // Save detailed structure for UI rehydration
    stored.detailedStakeholders = newStakeholders;

    // Save legacy structure for Rules Engine compatibility
    stored.changeTheory = stored.changeTheory || {};
    stored.changeTheory.stakeholders = newStakeholders.map(s => ({
        id: s.id,
        name: s.name,
        currentState: { 
            context: s.description, 
            practices: s.changes.map(c => c.current).join('. ') 
        },
        desiredChange: { 
            targetPractices: s.changes.map(c => c.target).join('. ') 
        }
    }));

    // Generate Outcomes list from these specific changes
    // Preserve the Main Program Goal (out-001) from Step 2
    const mainGoal = stored.outcomes?.find(o => o.id === 'out-001') || (stored.outcomes && stored.outcomes.length > 0 ? stored.outcomes[0] : null);
    stored.outcomes = mainGoal ? [mainGoal] : [];

    // Append stakeholder-specific outcomes
    newStakeholders.forEach(s => {
        s.changes.forEach(c => {
            if (c.target.trim()) {
                stored.outcomes.push({
                    id: c.id,
                    statement: c.target,
                    affectsStakeholders: [s.id],
                    indicators: c.indicator ? [{ value: c.indicator }] : []
                });
            }
        });
    });

    const result = validateLFA(stored);
    setValidation(result);
  };

  const handleNameChange = (index, val) => {
      setTouched(true);
      const updated = [...formData.stakeholders];
      updated[index].name = val;
      updateStateAndStorage(updated);
  };

  const handleChangeRowUpdate = (sIndex, cIndex, field, val) => {
      setTouched(true);
      const updated = [...formData.stakeholders];
      updated[sIndex].changes[cIndex][field] = val;
      updateStateAndStorage(updated);
  };

  const addChangeRow = (sIndex) => {
      const updated = [...formData.stakeholders];
      updated[sIndex].changes.push(createEmptyChange());
      updateStateAndStorage(updated);
  };

  const removeChangeRow = (sIndex, cIndex) => {
      const updated = [...formData.stakeholders];
      updated[sIndex].changes.splice(cIndex, 1);
      updateStateAndStorage(updated);
  };

  const addStakeholder = () => {
    const updated = [...formData.stakeholders, createEmptyStakeholder()];
    updateStateAndStorage(updated);
  };

  const removeStakeholder = (index) => {
    const updated = [...formData.stakeholders];
    updated.splice(index, 1);
    updateStateAndStorage(updated);
  };

  const handleNext = () => {
    const stored = getStoredData();
    // Ensure final save
    stored.detailedStakeholders = formData.stakeholders;
    saveStoredData(stored);

    // Validation
    if (formData.stakeholders.length === 0 || !formData.stakeholders[0].name.trim()) {
         alert("Please add at least one stakeholder.");
         return;
    }
    
    // Strict block check? No, permissive.
    navigate('/activities');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <ProgressBar currentStep={3} totalSteps={5} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-10 text-center">
            <div className="inline-block p-3 bg-green-100 rounded-2xl mb-4">
               <span className="text-4xl">👥</span>
            </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Stakeholders & Outcomes</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Define who needs to change, what specific behaviors they must adopt, and how you will measure that change.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
             <div className="lg:col-span-3 space-y-8">
                
                {formData.stakeholders.map((stakeholder, sIndex) => (
                    <Card 
                        key={stakeholder.id}
                        className="shadow-xl border-green-100/50 relative overflow-visible"
                    >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500 rounded-l"></div>
                    
                    {/* Stakeholder Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                        <div className="flex-1 mr-4">
                            <Label className="text-xs uppercase tracking-wide text-gray-400 mb-1">Stakeholder Group</Label>
                            <Input
                                type="text"
                                value={stakeholder.name}
                                onChange={(e) => handleNameChange(sIndex, e.target.value)}
                                placeholder="e.g., Teachers, Students, Parents"
                                className="text-xl font-bold text-gray-900 border-transparent hover:border-gray-200 focus:border-green-500 px-2 -ml-2 rounded"
                            />
                        </div>
                        {formData.stakeholders.length > 1 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStakeholder(sIndex)}
                                className="text-red-400 hover:text-red-700 hover:bg-red-50"
                            >
                                Remove Group
                            </Button>
                        )}
                    </div>

                    {/* Change Rows */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-12 gap-4 px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:grid">
                            <div className="col-span-4">Current Practice (Status Quo)</div>
                            <div className="col-span-4">Desired Outcome (New Behavior)</div>
                            <div className="col-span-3">Success Indicator</div>
                            <div className="col-span-1"></div>
                        </div>

                        {stakeholder.changes.map((change, cIndex) => (
                            <div key={change.id} className="relative group bg-white md:bg-gray-50/50 rounded-lg p-4 md:p-2 border border-gray-100 hover:border-green-200 transition-colors">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                                    {/* Mobile Labels included for responsiveness */}
                                    <div className="md:col-span-4">
                                        <Label className="md:hidden text-xs mb-1">Current Practice</Label>
                                        <Textarea
                                            value={change.current}
                                            onChange={(e) => handleChangeRowUpdate(sIndex, cIndex, 'current', e.target.value)}
                                            placeholder="What do they do now?"
                                            rows={2}
                                            className="text-sm bg-white"
                                        />
                                    </div>

                                    <div className="md:col-span-4 relative">
                                        <div className="hidden md:block absolute -left-3 top-1/2 -mt-2 text-gray-300">→</div>
                                        <Label className="md:hidden text-xs mb-1">Desired Outcome</Label>
                                        <Textarea
                                            value={change.target}
                                            onChange={(e) => handleChangeRowUpdate(sIndex, cIndex, 'target', e.target.value)}
                                            placeholder="What is the new behavior?"
                                            rows={2}
                                            className="text-sm border-green-200 bg-green-50/30 focus:border-green-400"
                                        />
                                    </div>

                                    <div className="md:col-span-3">
                                        <Label className="md:hidden text-xs mb-1">Indicator</Label>
                                        <Textarea
                                            value={change.indicator}
                                            onChange={(e) => handleChangeRowUpdate(sIndex, cIndex, 'indicator', e.target.value)}
                                            placeholder="% or # measure"
                                            rows={2}
                                            className="text-sm border-blue-100 bg-blue-50/10 focus:border-blue-300"
                                        />
                                    </div>

                                    <div className="md:col-span-1 flex justify-end md:justify-center pt-2">
                                        {stakeholder.changes.length > 1 && (
                                            <button 
                                                onClick={() => removeChangeRow(sIndex, cIndex)}
                                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                title="Remove this outcome"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => addChangeRow(sIndex)}
                            className="text-green-600 hover:text-green-800 hover:bg-green-50 text-sm font-medium w-full border border-dashed border-green-200 py-2"
                        >
                            + Add another outcome/behavior for {stakeholder.name || 'this group'}
                        </Button>
                    </div>
                    </Card>
                ))}

                <Button 
                    variant="outline" 
                    className="w-full border-dashed border-2 py-6 text-gray-500 hover:border-green-300 hover:text-green-600 transition-all text-lg"
                    onClick={addStakeholder}
                >
                    + Add New Stakeholder Group
                </Button>

                 {/* Navigation Buttons */}
                 <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-gray-100">
                    <Button 
                        variant="secondary" 
                        onClick={() => navigate('/problem-outcome')}
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
                        Next: Activities →
                    </Button>
                </div>

             </div>

             <div className="space-y-6">
                 <div className="sticky top-8">
                    {validation?.resultsBySeverity?.warning?.length > 0 ? (
                        <InsightBox
                            type="warning"
                            title="AI Check"
                            message={validation.resultsBySeverity.warning[0].suggestion}
                            highlight={true}
                        />
                    ) : (
                        <InsightBox
                            type="info"
                            title="Helper"
                            message="Break down behavior changes into specific items. Each 'Desired Outcome' here will become a goal you can link activities to in the next step."
                            />
                    )}
                    
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm text-sm text-gray-500">
                        <p className="font-semibold text-gray-700 mb-2">Tips:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Group behaviors by stakeholder (Teacher, Student).</li>
                            <li>Use indicators to make outcomes measurable.</li>
                            <li>One row = One specific behavior shift.</li>
                        </ul>
                    </div>

                    {validation && <ValidationDisplay validationResult={validation} />}
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
}
