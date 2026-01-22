export default function ProgressBar({ currentStep, totalSteps }) {
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { name: 'Basics', number: 1 },
    { name: 'Problem & Outcome', number: 2 },
    { name: 'Stakeholders', number: 3 },
    { name: 'Activities', number: 4 },
    { name: 'Framework', number: 5 }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-gray-700">
              Step {currentStep} of {totalSteps}
            </h2>
            <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mt-6">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step.number < currentStep
                    ? 'bg-green-500 text-white'
                    : step.number === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step.number < currentStep ? '✓' : step.number}
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center w-16">
                {step.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
