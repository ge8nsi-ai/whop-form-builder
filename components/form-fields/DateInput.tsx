"use client";

interface Props {
	label: string;
	required: boolean;
	value: string;
	onChange: (value: string) => void;
}

export function DateInput({ label, required, value, onChange }: Props) {
	return (
		<div className="flex flex-col gap-1.5">
			<label className="text-3 font-medium text-gray-12">
				{label}
				{required && <span className="text-red-9 ml-1">*</span>}
			</label>
			<input
				type="date"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				required={required}
				className="w-full px-3 py-2 rounded-lg border border-gray-a4 bg-gray-a2 text-gray-12 focus:outline-none focus:ring-2 focus:ring-blue-a8 focus:border-transparent text-3"
			/>
		</div>
	);
}
