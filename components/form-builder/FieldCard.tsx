"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FormField } from "@/lib/types";
import { FIELD_TYPE_LABELS } from "@/lib/types";

interface Props {
	field: FormField;
	isEditing: boolean;
	onEdit: () => void;
}

export function FieldCard({ field, isEditing, onEdit }: Props) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: field.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
				isEditing
					? "border-blue-a8 bg-blue-a2"
					: "border-gray-a4 bg-gray-a1 hover:bg-gray-a2"
			}`}
			onClick={onEdit}
		>
			<button
				type="button"
				{...attributes}
				{...listeners}
				className="cursor-grab active:cursor-grabbing text-gray-8 hover:text-gray-11 text-4 p-1 bg-transparent border-none touch-none"
				onClick={(e) => e.stopPropagation()}
			>
				⠿
			</button>
			<div className="flex-1 min-w-0">
				<div className="text-3 font-medium text-gray-12 truncate">
					{field.label}
				</div>
				<div className="text-2 text-gray-9">
					{FIELD_TYPE_LABELS[field.type]}
					{field.required && " · Required"}
				</div>
			</div>
			<div className="text-2 text-gray-7 flex-shrink-0">
				{field.options?.length ? `${field.options.length} options` : ""}
			</div>
		</div>
	);
}
