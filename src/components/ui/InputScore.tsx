export function InputScore({
  label,
  weight,
  value,
  onChange,
  inputClass,
}: {
  label: string;
  weight: number;
  value: number | undefined;
  onChange: (v: number) => void;
  inputClass: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1 pr-4">
        <p className="font-medium text-[#d8bd71] text-lg">{label}</p>
        <p className="text-sm text-gray-300 italic">Weight: {weight}%</p>
      </div>

      <input
        type="number"
        min={0}
        max={weight}
        placeholder={`0–${weight}`}
        value={value ?? ""}
        onChange={(e) =>
          onChange(
            Math.min(weight, Math.max(0, Number(e.target.value)))
          )
        }
        className={`${inputClass} ${
          value == null ? "border border-red-400" : "border border-[#bea256]/40"
        }`}
      />
    </div>
  );
}
