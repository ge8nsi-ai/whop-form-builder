"use client";

import { useState } from "react";
import { Button, Card, Heading, Text } from "@whop/react/components";
import { v4 as uuid } from "uuid";
import type { Form, FormField } from "@/lib/types";
import { saveResponse } from "@/lib/storage";
import {
	TextInput,
	TextareaInput,
	EmailInput,
	NumberInput,
	SelectInput,
	RadioInput,
	CheckboxInput,
	DateInput,
	RatingInput,
	FileInput,
} from "@/components/form-fields";
import { SuccessScreen } from "./SuccessScreen";

interface Props {
	form: Form;
}

export function FormRenderer({ form }: Props) {
	const [values, setValues] = useState<Record<string, any>>({});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitted, setSubmitted] = useState(false);

	function setValue(fieldId: string, value: any) {
		setValues((prev) => ({ ...prev, [fieldId]: value }));
		setErrors((prev) => {
			const next = { ...prev };
			delete next[fieldId];
			return next;
		});
	}

	function getValue(fieldId: string) {
		return values[fieldId] ?? ("" as any);
	}

	function validate(): boolean {
		const newErrors: Record<string, string> = {};
		for (const field of form.fields) {
			if (!field.required) continue;
			const val = values[field.id];
			if (field.type === "checkbox") {
				if (!Array.isArray(val) || val.length === 0) {
					newErrors[field.id] = "This field is required";
				}
			} else if (field.type === "rating") {
				if (!val || val < 1) {
					newErrors[field.id] = "Please select a rating";
				}
			} else if (field.type === "file") {
				if (!val) {
					newErrors[field.id] = "Please upload a file";
				}
			} else if (!val || (typeof val === "string" && !val.trim())) {
				newErrors[field.id] = "This field is required";
			}
			if (field.type === "email" && val && typeof val === "string") {
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
					newErrors[field.id] = "Please enter a valid email";
				}
			}
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!validate()) return;

		const response = {
			id: uuid(),
			formId: form.id,
			data: values,
			submittedAt: Date.now(),
		};
		saveResponse(response);
		setSubmitted(true);
	}

	if (submitted) {
		return <SuccessScreen formTitle={form.title} />;
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			<div className="mb-2">
				<Heading size="6" weight="bold">{form.title}</Heading>
				{form.description && (
					<Text size="3" color="gray" className="mt-1">{form.description}</Text>
				)}
			</div>

			{form.fields.map((field) => (
				<div key={field.id}>
					{renderField(field, getValue(field.id), (v) =>
						setValue(field.id, v),
					)}
					{errors[field.id] && (
						<Text size="1" color="red" className="mt-1 block">{errors[field.id]}</Text>
					)}
				</div>
			))}

			<Button type="submit" variant="classic" size="3" className="mt-2">
				Submit
			</Button>
		</form>
	);
}

function renderField(
	field: FormField,
	value: any,
	onChange: (v: any) => void,
) {
	const common = {
		label: field.label,
		required: field.required,
		placeholder: field.placeholder,
	};

	switch (field.type) {
		case "text":
			return <TextInput {...common} value={value || ""} onChange={onChange} />;
		case "textarea":
			return (
				<TextareaInput {...common} value={value || ""} onChange={onChange} />
			);
		case "email":
			return <EmailInput {...common} value={value || ""} onChange={onChange} />;
		case "number":
			return (
				<NumberInput {...common} value={value || ""} onChange={onChange} />
			);
		case "select":
			return (
				<SelectInput
					{...common}
					options={field.options || []}
					value={value || ""}
					onChange={onChange}
				/>
			);
		case "radio":
			return (
				<RadioInput
					{...common}
					options={field.options || []}
					value={value || ""}
					onChange={onChange}
				/>
			);
		case "checkbox":
			return (
				<CheckboxInput
					{...common}
					options={field.options || []}
					value={value || []}
					onChange={onChange}
				/>
			);
		case "date":
			return <DateInput {...common} value={value || ""} onChange={onChange} />;
		case "rating":
			return (
				<RatingInput
					{...common}
					value={value || 0}
					onChange={onChange}
				/>
			);
		case "file":
			return (
				<FileInput
					{...common}
					value={value || null}
					onChange={onChange}
				/>
			);
		default:
			return null;
	}
}
