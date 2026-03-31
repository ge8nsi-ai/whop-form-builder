"use client";

import { Button } from "@whop/react/components";
import type { FieldType } from "@/lib/types";
import { FIELD_TYPE_LABELS, FIELD_ICONS } from "@/lib/types";

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
	"file",
];

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
