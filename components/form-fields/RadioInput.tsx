"use client";

interface Props {
	label: string;
	required: boolean;
	options: string[];
	value: string;
	onChange: (value: string) => void;
}

export function RadioInput({ label, required, options, value, onChange }: Props) {
	return (
		<fieldset className="flex flex-col gap-1.5">
			<legend className="text-3 font-medium text-gray-12">
				{label}
				{required && <span className="text-red-9 ml-1">*</span>}
			</legend>
			<div className="flex flex-col gap-2">
				{options.map((opt) => (
					<label
						key={opt}
						className="flex items-center gap-2 cursor-pointer text-3 text-gray-11 hover:text-gray-12"
					>
						<input
							type="radio"
							name={label}
							value={opt}
							checked={value === opt}
							onChange={() => onChange(opt)}
							required={required && !value}
							className="w-4 h-4 accent-blue-9"
						/>
						{opt}
					</label>
				))}
			</div>
		</fieldset>
	);
}
