function FormInput({
  label,
  name,
  type = 'text',
  register,
  error,
  required = false,
  as = 'input',
  options = [],
  disabled = false,
  ...rest
}) {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label fw-semibold">
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}

      {as === 'select' ? (
        <select
          id={name}
          className={`form-select ${error ? 'is-invalid' : ''}`}
          disabled={disabled}
          {...(register ? register(name) : {})}
          {...rest}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          disabled={disabled}
          {...(register ? register(name) : {})}
          {...rest}
        />
      )}

      {error && <div className="invalid-feedback d-block">{error.message}</div>}
    </div>
  )
}

export default FormInput
