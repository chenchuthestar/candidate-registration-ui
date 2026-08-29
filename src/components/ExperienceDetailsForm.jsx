import { useFormContext, useFieldArray } from 'react-hook-form'
import FormInput from './FormInput.jsx'
import { defaultExperienceRow } from '../validation/validationSchemas.js'

function ExperienceDetailsForm() {
  const {
    register,
    control,
    watch,
    formState: { errors }
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experienceDetails'
  })

  return (
    <div>
      <h4 className="mb-4">Experience Details</h4>

      {fields.map((field, index) => {
        const currentlyWorking = watch(`experienceDetails.${index}.currentlyWorking`)

        return (
          <div className="experience-block" key={field.id}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Experience #{index + 1}</h6>
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
                  label="Company Name"
                  name={`experienceDetails.${index}.companyName`}
                  register={register}
                  error={errors.experienceDetails?.[index]?.companyName}
                  required
                  placeholder="Company name"
                />
              </div>
              <div className="col-md-6">
                <FormInput
                  label="Designation"
                  name={`experienceDetails.${index}.designation`}
                  register={register}
                  error={errors.experienceDetails?.[index]?.designation}
                  required
                  placeholder="Designation"
                />
              </div>
              <div className="col-md-4">
                <FormInput
                  label="CTC (Lakhs/Year)"
                  name={`experienceDetails.${index}.ctc`}
                  type="number"
                  register={register}
                  error={errors.experienceDetails?.[index]?.ctc}
                  required
                  placeholder="Example: 8.50"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="col-md-4">
                <FormInput
                  label="From Date"
                  name={`experienceDetails.${index}.fromDate`}
                  type="date"
                  register={register}
                  error={errors.experienceDetails?.[index]?.fromDate}
                  required
                />
              </div>
              {!currentlyWorking && (
                <div className="col-md-4">
                  <FormInput
                    label="To Date"
                    name={`experienceDetails.${index}.toDate`}
                    type="date"
                    register={register}
                    error={errors.experienceDetails?.[index]?.toDate}
                    required
                  />
                </div>
              )}
              <div className="col-md-4 d-flex align-items-center">
                <div className="form-check mt-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`currentlyWorking-${index}`}
                    {...register(`experienceDetails.${index}.currentlyWorking`)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`currentlyWorking-${index}`}
                  >
                    Currently Working
                  </label>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {typeof errors.experienceDetails?.message === 'string' && (
        <div className="text-danger mb-2">{errors.experienceDetails.message}</div>
      )}

      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() => append(defaultExperienceRow)}
      >
        + Add Experience
      </button>
    </div>
  )
}

export default ExperienceDetailsForm