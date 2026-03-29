"use client";

import { RadioGroup, Text } from "@whop/react/components";

interface Props {
	label: string;
	required: boolean;
	options: string[];
	value: string;
	onChange: (value: string) => void;
}

export function RadioInput({ label, required, options, value, onChange }: Props) {
	return (
		<fieldset className="flex flex-col gap-1.5 border-none p-0 m-0">
			<legend className="text-2 font-medium text-gray-11">
				{label}
				{required && <span className="text-red-9 ml-1">*</span>}
			</legend>
			<RadioGroup.Root value={value} onValueChange={onChange}>
				{options.map((opt) => (
					<RadioGroup.Item key={opt} value={opt}>
						{opt}
					</RadioGroup.Item>
				))}
			</RadioGroup.Root>
		</fieldset>
	);
}
