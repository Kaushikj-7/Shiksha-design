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

export default function Basics() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    programName: '',
    description: ''
  });
  const [validation, setValidation] = useState(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const stored = getStoredData();
    if (stored.program) {
        setFormData({
            programName: stored.program.name || '',
            description: stored.program.description || ''
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
    
    // Auto-save
    saveStoredData(stored);

    // Validate ONLY the current step's fields
    if (!formData.programName.trim()) {
        alert("Please enter a Program Name");
        return;
    }
    if (!formData.description.trim()) {
        alert("Please enter a Description");
        return;
    }

    // If basic checks pass, allow navigation despite downstream errors
    navigate('/problem-outcome');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <ProgressBar currentStep={1} totalSteps={5} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <div className="inline-block p-3 bg-blue-100 rounded-2xl mb-4">
             <span className="text-4xl">📝</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Let's Start with the Basics
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Give your program a clear name and description. This is the foundation for everything else.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
                 {/* Form */}
                <Card className="shadow-lg border-blue-100/50">
                    <div className="space-y-6">
                        {/* Program Name */}
                        <div>
                        <Label htmlFor="programName" required>Program Name</Label>
                        <Input
                            id="programName"
                            type="text"
                            name="programName"
                            value={formData.programName}
                            onChange={handleChange}
                            placeholder="e.g., Rural Health Access Initiative"
                            error={touched && !formData.programName ? "Program name is required" : null}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            This name will appear in your final framework report
                        </p>
                        </div>

                        {/* Description */}
                        <div>
                        <Label htmlFor="description" required>Program Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what your program aims to achieve..."
                            rows={6}
                             error={touched && formData.description.length < 10 ? "Description should be at least 10 characters" : null}
                        />
                        </div>
                    </div>
                </Card>

                 {/* Navigation Buttons */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-8">
                    <Button 
                        variant="secondary" 
                        onClick={handleBack}
                        className="w-full sm:w-auto"
                    >
                        ← Back to Home
                    </Button>
                    <Button 
                        variant="primary" 
                        size="lg"
                        onClick={handleNext}
                        className="w-full sm:w-auto min-w-[160px]"
                    >
                        Next Step →
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                 {/* Insight Box */}
                <InsightBox
                    type="info"
                    title="💡 Why we're asking"
                    message="Think of this as your funding proposal's 'Executive Summary'. Donors need to clearly understand WHO you are helping and WHAT you are changing."
                />

                {/* Validation Results */}
                {validation && <ValidationDisplay validationResult={validation} />}
            </div>
        </div>
      </div>
    </div>
  );
}
