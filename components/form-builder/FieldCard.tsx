"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge, Text } from "@whop/react/components";
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
			className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${
				isEditing
					? "border-blue-a8 bg-blue-a2 shadow-sm"
					: "border-gray-a4 bg-gray-1 hover:bg-gray-a2 hover:border-gray-a5"
			}`}
			onClick={onEdit}
		>
			<button
				type="button"
				{...attributes}
				{...listeners}
				className="cursor-grab active:cursor-grabbing text-gray-8 hover:text-gray-11 text-4 p-1 bg-transparent border-none touch-none select-none"
				onClick={(e) => e.stopPropagation()}
			>
				⠿
			</button>
			<div className="flex-1 min-w-0">
				<Text size="3" weight="medium" className="block truncate">
					{field.label}
				</Text>
				<div className="flex gap-2 mt-1">
					<Badge variant="soft" size="1" color="gray">
						{FIELD_TYPE_LABELS[field.type]}
					</Badge>
					{field.required && (
						<Badge variant="soft" size="1" color="red">
							Required
						</Badge>
					)}
				</div>
			</div>
			{field.options?.length ? (
				<Text size="1" color="gray" className="flex-shrink-0">
					{field.options.length} options
				</Text>
			) : null}
		</div>
	);
}
