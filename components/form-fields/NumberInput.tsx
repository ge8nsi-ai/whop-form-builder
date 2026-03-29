"use client";

interface Props {
	label: string;
	required: boolean;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
}

export function NumberInput({ label, required, placeholder, value, onChange }: Props) {
	return (
		<div className="flex flex-col gap-1.5">
			<label className="text-3 font-medium text-gray-12">
				{label}
				{required && <span className="text-red-9 ml-1">*</span>}
			</label>
			<input
				type="number"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				required={required}
				className="w-full px-3 py-2 rounded-lg border border-gray-a4 bg-gray-a2 text-gray-12 placeholder:text-gray-8 focus:outline-none focus:ring-2 focus:ring-blue-a8 focus:border-transparent text-3"
			/>
		</div>
	);
}
