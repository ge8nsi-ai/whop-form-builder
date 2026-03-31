export type FieldType =
	| "text"
	| "textarea"
	| "email"
	| "number"
	| "select"
	| "radio"
	| "checkbox"
	| "date"
	| "rating"
	| "file";

export interface FormField {
	id: string;
	type: FieldType;
	label: string;
	required: boolean;
	options?: string[];
	placeholder?: string;
}

export interface Form {
	id: string;
	companyId: string;
	title: string;
	description: string;
	fields: FormField[];
	createdAt: number;
	updatedAt: number;
}

export interface FormResponse {
	id: string;
	formId: string;
	data: Record<string, any>;
	submittedAt: number;
}

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
	text: "Short Text",
	textarea: "Long Text",
	email: "Email",
	number: "Number",
	select: "Dropdown",
	radio: "Single Choice",
	checkbox: "Multiple Choice",
	date: "Date",
	rating: "Rating",
	file: "File Upload",
};

export const FIELD_ICONS: Record<FieldType, string> = {
	text: "Aa",
	textarea: "¶",
	email: "@",
	number: "#",
	select: "▾",
	radio: "◉",
	checkbox: "☑",
	date: "📅",
	rating: "★",
	file: "📎",
};
