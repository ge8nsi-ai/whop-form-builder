"use client";

import { Button, Badge } from "@whop/react/components";
import type { FieldType } from "@/lib/types";
import { FIELD_TYPE_LABELS } from "@/lib/types";

interface Props {
	onAdd: (type: FieldType) => void;
}

const FIELD_TYPES: FieldType[] = [
	"text",
	"textarea",
	"email",
	"number",
	"select",
	"radio",
	"checkbox",
	"date",
	"rating",
];

const FIELD_ICONS: Record<FieldType, string> = {
	text: "Aa",
	textarea: "¶",
	email: "@",
	number: "#",
	select: "▾",
	radio: "◉",
	checkbox: "☑",
	date: "📅",
	rating: "★",
};

export function FieldTypePicker({ onAdd }: Props) {
	return (
		<div className="flex flex-wrap gap-2">
			{FIELD_TYPES.map((type) => (
				<Button
					key={type}
					variant="soft"
					size="2"
					onClick={() => onAdd(type)}
				>
					<span className="mr-1.5 opacity-70">{FIELD_ICONS[type]}</span>
					{FIELD_TYPE_LABELS[type]}
				</Button>
			))}
		</div>
	);
}
