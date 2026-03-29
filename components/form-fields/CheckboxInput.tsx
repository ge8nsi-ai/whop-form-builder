"use client";

import { Checkbox, Text } from "@whop/react/components";

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
		<fieldset className="flex flex-col gap-1.5 border-none p-0 m-0">
			<legend className="text-2 font-medium text-gray-11">
				{label}
				{required && <span className="text-red-9 ml-1">*</span>}
			</legend>
			<div className="flex flex-col gap-2">
				{options.map((opt) => (
					<Checkbox
						key={opt}
						checked={value.includes(opt)}
						onCheckedChange={() => toggle(opt)}
					>
						{opt}
					</Checkbox>
				))}
			</div>
		</fieldset>
	);
}
