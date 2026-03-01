type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  hint?: string;
};

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  hint,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[13px] font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-[13px] text-text-primary bg-bg-secondary border border-border rounded-lg px-3.5 py-2.5 outline-none placeholder:text-text-tertiary focus:border-accent transition-colors duration-150"
      />
      {hint && <p className="text-[12px] text-text-tertiary">{hint}</p>}
    </div>
  );
}
