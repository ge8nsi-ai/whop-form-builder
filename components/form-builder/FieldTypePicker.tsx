"use client";

import { Button } from "@whop/react/components";
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

export function FieldTypePicker({ onAdd }: Props) {
	return (
		<div className="flex flex-wrap gap-2">
			{FIELD_TYPES.map((type) => (
				<Button
					key={type}
					variant="ghost"
					size="2"
					onClick={() => onAdd(type)}
				>
					+ {FIELD_TYPE_LABELS[type]}
				</Button>
			))}
		</div>
	);
}
