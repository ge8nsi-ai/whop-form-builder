"use client";

import { TextField, Text } from "@whop/react/components";

interface Props {
	label: string;
	required: boolean;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
}

export function TextInput({ label, required, placeholder, value, onChange }: Props) {
	return (
		<div className="flex flex-col gap-1.5">
			<Text as="label" size="2" weight="medium" color="gray">
				{label}
				{required && <span className="text-red-9 ml-1">*</span>}
			</Text>
			<TextField.Root size="2">
				<TextField.Input
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
				/>
			</TextField.Root>
		</div>
	);
}
