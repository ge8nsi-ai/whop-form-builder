"use client";

import { Button } from "@whop/react/components";
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
		<div className="border border-gray-a4 rounded-xl p-4 bg-gray-a1 flex flex-col gap-3">
			<div className="flex justify-between items-center">
				<h3 className="text-4 font-semibold text-gray-12">
					Edit {FIELD_TYPE_LABELS[field.type]}
				</h3>
				<button
					type="button"
					onClick={onClose}
					className="text-gray-8 hover:text-gray-11 text-3 cursor-pointer bg-transparent border-none"
				>
					✕
				</button>
			</div>

			<div className="flex flex-col gap-1.5">
				<label className="text-2 font-medium text-gray-11">Label</label>
				<input
					type="text"
					value={label}
					onChange={(e) => setLabel(e.target.value)}
					className="w-full px-3 py-2 rounded-lg border border-gray-a4 bg-gray-a2 text-gray-12 text-3 focus:outline-none focus:ring-2 focus:ring-blue-a8"
				/>
			</div>

			{field.type !== "rating" && field.type !== "checkbox" && field.type !== "radio" && (
				<div className="flex flex-col gap-1.5">
					<label className="text-2 font-medium text-gray-11">Placeholder</label>
					<input
						type="text"
						value={placeholder}
						onChange={(e) => setPlaceholder(e.target.value)}
						className="w-full px-3 py-2 rounded-lg border border-gray-a4 bg-gray-a2 text-gray-12 text-3 focus:outline-none focus:ring-2 focus:ring-blue-a8"
					/>
				</div>
			)}

			{NEEDS_OPTIONS.includes(field.type) && (
				<div className="flex flex-col gap-1.5">
					<label className="text-2 font-medium text-gray-11">
						Options (one per line)
					</label>
					<textarea
						value={options}
						onChange={(e) => setOptions(e.target.value)}
						rows={4}
						className="w-full px-3 py-2 rounded-lg border border-gray-a4 bg-gray-a2 text-gray-12 text-3 focus:outline-none focus:ring-2 focus:ring-blue-a8 resize-y"
					/>
				</div>
			)}

			<label className="flex items-center gap-2 cursor-pointer text-3 text-gray-11">
				<input
					type="checkbox"
					checked={required}
					onChange={(e) => setRequired(e.target.checked)}
					className="w-4 h-4 accent-blue-9"
				/>
				Required field
			</label>

			<div className="flex gap-2 justify-end">
				<Button variant="ghost" size="2" onClick={onDelete}>
					Delete
				</Button>
				<Button variant="classic" size="2" onClick={handleSave}>
					Save
				</Button>
			</div>
		</div>
	);
}
