"use client";

interface Props {
	label: string;
	required: boolean;
	options: string[];
	value: string[];
	onChange: (value: string[]) => void;
}

export function CheckboxInput({ label, required, options, value, onChange }: Props) {
	function toggle(option: string) {
		if (value.includes(option)) {
			onChange(value.filter((v) => v !== option));
		} else {
			onChange([...value, option]);
		}
	}

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
							type="checkbox"
							value={opt}
							checked={value.includes(opt)}
							onChange={() => toggle(opt)}
							className="w-4 h-4 accent-blue-9"
						/>
						{opt}
					</label>
				))}
			</div>
		</fieldset>
	);
}
