'use client'

const Input = ({ 
  label,
  id,
  type = 'text',
  error,
  className = "",
  labelClassName = "",
  errorClassName = "",
  ...props 
}) => {
  const baseInputClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f0a647] focus:border-transparent outline-none transition-all ${
    error ? 'border-red-300' : 'border-gray-300'
  } ${className}`
  
  const baseLabelClasses = `block text-sm font-medium text-gray-700 mb-2 ${labelClassName}`
  const baseErrorClasses = `mt-1 text-sm text-red-600 ${errorClassName}`

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={id}
          className={`${baseInputClasses} resize-none`}
          rows={props.rows || 4}
          {...props}
        />
      )
    }
    
    return (
      <input
        id={id}
        type={type}
        className={baseInputClasses}
        {...props}
      />
    )
  }

  return (
    <div>
      {label && (
        <label htmlFor={id} className={baseLabelClasses}>
          {label}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className={baseErrorClasses}>
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
