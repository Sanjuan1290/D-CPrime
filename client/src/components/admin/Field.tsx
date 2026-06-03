type FieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

function Field({ label, value, onChange }: FieldProps) {
  return (
    <label className="block text-sm font-semibold text-zinc-300">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20"
      />
    </label>
  )
}

export default Field
