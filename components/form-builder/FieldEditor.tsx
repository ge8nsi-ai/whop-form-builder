"use client";

import { Button, TextField, TextArea, Checkbox, Text, Card, IconButton } from "@whop/react/components";
import { useState, useEffect } from "react";
import type { FormField, FieldType } from "@/lib/types";
import { FIELD_TYPE_LABELS } from "@/lib/types";

interface Props {
	field: FormField;
	onUpdate: (field: FormField) => void;
	onDelete: () => void;
	onClose: () => void;
}

const NEEDS_OPTIONS: FieldType[] = ["select", "radio", "checkbox"];

export function FieldEditor({ field, onUpdate, onDelete, onClose }: Props) {
	const [label, setLabel] = useState(field.label);
	const [required, setRequired] = useState(field.required);
	const [placeholder, setPlaceholder] = useState(field.placeholder || "");
	const [options, setOptions] = useState(field.options?.join("\n") || "");

	useEffect(() => {
		setLabel(field.label);
		setRequired(field.required);
		setPlaceholder(field.placeholder || "");
		setOptions(field.options?.join("\n") || "");
	}, [field]);

	function handleSave() {
		const updated: FormField = {
			...field,
			label,
			required,
			placeholder: placeholder || undefined,
			options: NEEDS_OPTIONS.includes(field.type)
				? options.split("\n").filter((o) => o.trim())
				: undefined,
		};
		onUpdate(updated);
		onClose();
	}

	return (
		<Card className="p-5">
			<div className="flex justify-between items-center mb-4">
				<Text size="4" weight="bold">
					Edit {FIELD_TYPE_LABELS[field.type]}
				</Text>
				<IconButton variant="ghost" size="2" onClick={onClose}>
					✕
				</IconButton>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-1.5">
					<Text as="label" size="2" weight="medium" color="gray">
						Label
					</Text>
					<TextField.Root size="2">
						<TextField.Input
							value={label}
							onChange={(e) => setLabel(e.target.value)}
							placeholder="Field label"
						/>
					</TextField.Root>
				</div>

				{field.type !== "rating" && field.type !== "checkbox" && field.type !== "radio" && (
					<div className="flex flex-col gap-1.5">
						<Text as="label" size="2" weight="medium" color="gray">
							Placeholder
						</Text>
						<TextField.Root size="2">
							<TextField.Input
								value={placeholder}
								onChange={(e) => setPlaceholder(e.target.value)}
								placeholder="Placeholder text"
							/>
						</TextField.Root>
					</div>
				)}

				{NEEDS_OPTIONS.includes(field.type) && (
					<div className="flex flex-col gap-1.5">
						<Text as="label" size="2" weight="medium" color="gray">
							Options (one per line)
						</Text>
						<TextArea
							value={options}
							onChange={(e) => setOptions(e.target.value)}
							rows={4}
							placeholder="Option 1&#10;Option 2&#10;Option 3"
						/>
					</div>
				)}

				<Checkbox checked={required} onCheckedChange={(v) => setRequired(!!v)}>
					Required field
				</Checkbox>

				<div className="flex gap-2 justify-end pt-2">
					<Button variant="soft" color="red" size="2" onClick={onDelete}>
						Delete
					</Button>
					<Button variant="classic" size="2" onClick={handleSave}>
						Save
					</Button>
				</div>
			</div>
		</Card>
	);
}
