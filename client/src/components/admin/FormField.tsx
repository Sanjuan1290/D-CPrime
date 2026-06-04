import type { ChangeEventHandler, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

type SelectOption = {
  label: string
  value: string
}

type BaseProps = {
  label: string
  name: string
  error?: string
  selectOptions?: SelectOption[]
  textarea?: boolean
}

type FormFieldProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'>

const fieldClass =
  'w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#1A1A2E] focus:ring-2 focus:ring-[#1A1A2E]/20'

function FormField({ label, name, error, selectOptions, textarea, className = '', ...props }: FormFieldProps) {
  const invalidClass = error ? 'border-red-400 bg-red-50 text-red-700 focus:border-red-500 focus:ring-red-100' : ''

  return (
    <label className="block text-sm font-semibold text-[#374151]">
      <span className="mb-1.5 block">{label}</span>
      {selectOptions ? (
        <select
          name={name}
          defaultValue={props.defaultValue as string | undefined}
          value={props.value as string | undefined}
          onChange={props.onChange as ChangeEventHandler<HTMLSelectElement> | undefined}
          required={props.required}
          className={`${fieldClass} ${invalidClass} ${className}`}
        >
          {selectOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea
          name={name}
          defaultValue={props.defaultValue as string | undefined}
          value={props.value as string | undefined}
          onChange={props.onChange as ChangeEventHandler<HTMLTextAreaElement> | undefined}
          required={props.required}
          placeholder={props.placeholder}
          className={`min-h-28 ${fieldClass} ${invalidClass} ${className}`}
        />
      ) : (
        <input name={name} className={`${fieldClass} ${invalidClass} ${className}`} {...props} />
      )}
      {error && <span className="mt-1.5 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  )
}

export default FormField
