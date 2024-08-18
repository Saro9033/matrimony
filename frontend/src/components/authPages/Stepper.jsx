import React from 'react';

const Stepper = ({ currentStep }) => {
  return (
    <div className="flex items-center mb-6">
      {[1, 2, 3, 4].map((step, index) => (
        <React.Fragment key={step}>
          <div className={`flex-1 text-center ${step === currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className={`inline-block w-8 h-8 rounded-full border-2 ${step === currentStep ? 'bg-blue-600 text-white' : step < currentStep ? 'text-white bg-green-600 border-gray-300' : 'border-gray-300'}`}>
              {step < currentStep ? "✓" : step}
            </div>
            <div className="mt-2 text-sm">
              {/* {step === 1
                ? "Basic"
                : step === 2
                  ? "Religious"
                  : step === 3
                    ? "Contact"
                    : step === 4
                      ? "Others"
                      : ""
              } */}
            </div>
          </div>
          {index < 3 && (
            <div
              className={`flex-grow h-1 ${step < currentStep ? 'bg-green-600' : 'bg-gray-300'} ${index === 0 ? 'mb-5' : 'mb-5'}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;
