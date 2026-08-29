import { useFormContext, useFieldArray } from 'react-hook-form'
import FormInput from './FormInput.jsx'
import { defaultEducationRow, qualificationOptions } from '../validation/validationSchemas.js'

function EducationDetailsForm() {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'educationDetails'
  })

  return (
    <div>
      <h4 className="mb-4">Educational Details</h4>

      {fields.map((field, index) => (
        <div className="education-block" key={field.id}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Qualification #{index + 1}</h6>
            {fields.length > 1 && (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => remove(index)}
              >
                Remove
              </button>
            )}
          </div>

          <div className="row">
            <div className="col-md-6">
              <FormInput
                label="Qualification"
                name={`educationDetails.${index}.qualification`}
                as="select"
                options={qualificationOptions}
                register={register}
                error={errors.educationDetails?.[index]?.qualification}
                required
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Institution Name"
                name={`educationDetails.${index}.institutionName`}
                register={register}
                error={errors.educationDetails?.[index]?.institutionName}
                required
                placeholder="Institution name"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Board or University"
                name={`educationDetails.${index}.boardOrUniversity`}
                register={register}
                error={errors.educationDetails?.[index]?.boardOrUniversity}
                required
                placeholder="Board or University"
              />
            </div>
            <div className="col-md-3">
              <FormInput
                label="Year of Passing"
                name={`educationDetails.${index}.yearOfPassing`}
                register={register}
                error={errors.educationDetails?.[index]?.yearOfPassing}
                required
                placeholder="YYYY"
                maxLength={4}
              />
            </div>
            <div className="col-md-3">
              <FormInput
                label="Percentage / CGPA"
                name={`educationDetails.${index}.score`}
                register={register}
                error={errors.educationDetails?.[index]?.score}
                required
                placeholder="e.g. 85 or 8.2"
              />
            </div>
          </div>
        </div>
      ))}

      {typeof errors.educationDetails?.message === 'string' && (
        <div className="text-danger mb-2">{errors.educationDetails.message}</div>
      )}

      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() => append(defaultEducationRow)}
      >
        + Add Education
      </button>
    </div>
  )
}

export default EducationDetailsForm
