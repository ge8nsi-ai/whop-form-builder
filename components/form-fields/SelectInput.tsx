"use client";

import { Select, Text } from "@whop/react/components";

interface Props {
	label: string;
	required: boolean;
	options: string[];
	value: string;
	onChange: (value: string) => void;
}

export function SelectInput({ label, required, options, value, onChange }: Props) {
	return (
		<div className="flex flex-col gap-1.5">
			<Text as="label" size="2" weight="medium" color="gray">
				{label}
				{required && <span className="text-red-9 ml-1">*</span>}
			</Text>
			<Select.Root value={value} onValueChange={onChange}>
				<Select.Trigger placeholder="Select an option" />
				<Select.Content>
					{options.map((opt) => (
						<Select.Item key={opt} value={opt}>
							{opt}
						</Select.Item>
					))}
				</Select.Content>
			</Select.Root>
		</div>
	);
}
