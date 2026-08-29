function ProgressStepper({ candidateType, currentStep }) {
  const baseSteps = ['Personal Details', 'Education Details']
  const steps =
    candidateType === 'Experienced'
      ? [...baseSteps, 'Experience Details', 'Review', 'Submit']
      : [...baseSteps, 'Review', 'Submit']

  return (
    <div className="stepper-wrapper">
      {steps.map((label, index) => {
        let status = ''
        if (index < currentStep) status = 'completed'
        else if (index === currentStep) status = 'active'

        return (
          <div key={label} className={`stepper-step ${status}`}>
            <div className="stepper-line"></div>
            <div className="stepper-circle">
              {index < currentStep ? '✓' : index + 1}
            </div>
            <div className="stepper-label">{label}</div>
          </div>
        )
      })}
    </div>
  )
}

export default ProgressStepper
