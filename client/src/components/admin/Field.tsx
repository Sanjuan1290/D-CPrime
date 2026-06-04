type FieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

function Field({ label, value, onChange }: FieldProps) {
  return (
    <label className="block text-sm font-semibold text-[#111827]">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-3 text-sm text-[#111827] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20"
      />
    </label>
  )
}

export default Field
