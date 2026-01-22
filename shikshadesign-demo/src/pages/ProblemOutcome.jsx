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

export default function ProblemOutcome() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    problem: '',
    outcome: '',
    indicator: ''
  });
  const [validation, setValidation] = useState(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const stored = getStoredData();
    if(stored) {
        setFormData({
            problem: stored.problemContext?.problem || '',
            outcome: stored.outcomes?.[0]?.statement || '',
            indicator: stored.outcomes?.[0]?.indicators?.[0]?.name || ''
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTouched(true);
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // Real-time validation
    const stored = getStoredData();
    // Safety check objects
    if (!stored.problemContext) stored.problemContext = {};
    if (!stored.outcomes) stored.outcomes = [];
    if (!stored.outcomes[0]) stored.outcomes[0] = { id: 'out-001', statement: '', indicators: [], scope: [] };
    if (!stored.outcomes[0].indicators) stored.outcomes[0].indicators = [];
    if (!stored.outcomes[0].indicators[0]) stored.outcomes[0].indicators[0] = { id: 'ind-001', name: '' };

    if (name === 'problem') stored.problemContext.problem = value;
    if (name === 'outcome') stored.outcomes[0].statement = value;
    if (name === 'indicator') {
        stored.outcomes[0].indicators[0].name = value;
        // Default target to satisfy validation (users can refine later)
        stored.outcomes[0].indicators[0].metric = { target: 100 }; 
    }
    
    const result = validateLFA(stored);
    setValidation(result);
  };

  const handleNext = () => {
    const stored = getStoredData();
    // Re-apply data to be sure
    stored.problemContext.problem = formData.problem;
    if (!stored.outcomes[0]) stored.outcomes[0] = { id: 'out-001', statement: '', indicators: [], scope: [] };
    stored.outcomes[0].statement = formData.outcome;
    if (!stored.outcomes[0].indicators[0]) stored.outcomes[0].indicators[0] = { id: 'ind-001', name: '' };
    stored.outcomes[0].indicators[0].name = formData.indicator;
    
    // Ensure metric target exists
    if (!stored.outcomes[0].indicators[0].metric) {
        stored.outcomes[0].indicators[0].metric = { target: 100 };
    }

    saveStoredData(stored);

    // Simple manual validation for User Experience
    if (!formData.problem.trim()) {
        alert("Please enter the Core Problem.");
        return;
    }
    if (!formData.outcome.trim()) {
        alert("Please enter the Desired Outcome.");
        return;
    }

    // Force navigation - bypass strict Rule Engine blocking
    navigate('/stakeholders');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <ProgressBar currentStep={2} totalSteps={5} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-10 text-center">
            <div className="inline-block p-3 bg-orange-100 rounded-2xl mb-4">
               <span className="text-4xl">🎯</span>
            </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Problem to Outcome: The Logic
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Define the problem you're addressing and the change you want to see. This is your program's core logic.
          </p>
        </div>

         <div className="grid gap-6 md:grid-cols-3">
             <div className="md:col-span-2 space-y-6">
                {/* Form */}
                <Card className="shadow-lg border-orange-100/50">
                <div className="space-y-8">
                    {/* Problem Definition */}
                    <div>
                        <Label htmlFor="problem" required>The Core Problem</Label>
                        <Textarea
                            id="problem"
                            name="problem"
                            value={formData.problem}
                            onChange={handleChange}
                            placeholder="e.g., High dropout rates among girls in rural secondary schools due to..."
                            className="bg-red-50/30 border-red-100 focus:border-red-300 focus:ring-red-100"
                            error={touched && !formData.problem ? "Problem statement is required" : null}
                        />
                         <p className="text-xs text-gray-500 mt-2">What is the specific negative situation you want to change?</p>
                    </div>

                     {/* Arrow Divider */}
                    <div className="flex justify-center -my-2 opacity-30">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>

                    {/* Outcome Definition */}
                    <div className="relative">
                        <Label htmlFor="outcome" required>High-Level Program Goal</Label>
                        <Textarea
                            id="outcome"
                            name="outcome"
                            value={formData.outcome}
                            onChange={handleChange}
                            placeholder="e.g., Improved foundational literacy for all students..."
                            className="bg-green-50/30 border-green-100 focus:border-green-300 focus:ring-green-100"
                            error={touched && !formData.outcome ? "Outcome statement is required" : null}
                        />
                         <p className="text-xs text-gray-500 mt-2">What is the big-picture impact you want to achieve?</p>
                    </div>

                     {/* Indicator */}
                    <div className="relative">
                         <Label htmlFor="indicator" required>Key Success Indicator</Label>
                         <Input
                            id="indicator"
                            type="text"
                            name="indicator"
                            value={formData.indicator}
                            onChange={handleChange}
                            placeholder="e.g., % of students achieving grade-level competency"
                            className="bg-blue-50/30 border-blue-100 focus:border-blue-300 focus:ring-blue-100"
                            error={touched && !formData.indicator ? "Indicator is required" : null}
                        />
                        <p className="text-xs text-gray-500 mt-2">How will you know the main goal is reached?</p>
                    </div>
                </div>
                </Card>

                 {/* Navigation Buttons */}
                 <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-8">
                    <Button 
                        variant="secondary" 
                        onClick={() => navigate('/basics')}
                        className="w-full sm:w-auto"
                    >
                        ← Back to Basics
                    </Button>
                    <Button 
                        variant="primary" 
                        size="lg"
                        onClick={handleNext}
                        className="w-full sm:w-auto min-w-[160px]"
                    >
                        Next: Stakeholders →
                    </Button>
                </div>
             </div>

             <div className="space-y-6">
                 {/* Insight Boxes */}
                 {validation?.resultsBySeverity?.warning?.length > 0 ? (
                    <InsightBox
                        type="warning"
                        title="⚠️ AI Design Companion"
                        message={validation.resultsBySeverity.warning[0].suggestion || "Check your input for clarity."}
                        highlight={true}
                    />
                 ) : (
                    <InsightBox
                        type="info"
                        title="💡 The Logic Chain"
                        message="Funders don't fund activities; they fund solutions to problems. This logic chain (Problem → Outcome → Indicator) is the #1 thing grant reviewers look for to assess impact."
                    />
                 )}
                {validation && <ValidationDisplay validationResult={validation} />}
             </div>
         </div>
      </div>
    </div>
  );
}
