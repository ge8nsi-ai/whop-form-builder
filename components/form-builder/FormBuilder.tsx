"use client";

import { useState } from "react";
import { TextField, TextArea, Text, Heading, Separator, Card } from "@whop/react/components";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { v4 as uuid } from "uuid";
import type { Form, FormField, FieldType } from "@/lib/types";
import { FIELD_TYPE_LABELS } from "@/lib/types";
import { saveForm } from "@/lib/storage";
import { FieldTypePicker } from "./FieldTypePicker";
import { FieldEditor } from "./FieldEditor";
import { FieldCard } from "./FieldCard";

interface Props {
	form: Form;
	onFormChange: (form: Form) => void;
}

export function FormBuilder({ form, onFormChange }: Props) {
	const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
	const [title, setTitle] = useState(form.title);
	const [description, setDescription] = useState(form.description);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	async function updateForm(updates: Partial<Form>) {
		const updated = { ...form, ...updates, updatedAt: Date.now() };
		onFormChange(updated);
		await saveForm(updated);
	}

	function handleTitleChange(value: string) {
		setTitle(value);
		updateForm({ title: value });
	}

	function handleDescriptionChange(value: string) {
		setDescription(value);
		updateForm({ description: value });
	}

	function addField(type: FieldType) {
		const newField: FormField = {
			id: uuid(),
			type,
			label: `New ${FIELD_TYPE_LABELS[type]}`,
			required: false,
			options: ["select", "radio", "checkbox"].includes(type)
				? ["Option 1", "Option 2"]
				: undefined,
			placeholder: undefined,
		};
		updateForm({ fields: [...form.fields, newField] });
		setEditingFieldId(newField.id);
	}

	function updateField(updatedField: FormField) {
		updateForm({
			fields: form.fields.map((f) =>
				f.id === updatedField.id ? updatedField : f,
			),
		});
	}

	function deleteField(fieldId: string) {
		updateForm({ fields: form.fields.filter((f) => f.id !== fieldId) });
		setEditingFieldId(null);
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIdx = form.fields.findIndex((f) => f.id === active.id);
		const newIdx = form.fields.findIndex((f) => f.id === over.id);
		updateForm({ fields: arrayMove(form.fields, oldIdx, newIdx) });
	}

	return (
		<div className="flex flex-col gap-6">
			<Card className="p-6">
				<TextField.Root size="3" className="mb-3">
					<TextField.Input
						value={title}
						onChange={(e) => handleTitleChange(e.target.value)}
						placeholder="Form Title"
					/>
				</TextField.Root>
				<TextField.Root size="2">
					<TextField.Input
						value={description}
						onChange={(e) => handleDescriptionChange(e.target.value)}
						placeholder="Add a description..."
					/>
				</TextField.Root>
			</Card>

			<div>
				<Text size="2" weight="medium" color="gray" className="mb-3 uppercase tracking-wider">
					Add Field
				</Text>
				<FieldTypePicker onAdd={addField} />
			</div>

			<Separator size="4" />

			{form.fields.length === 0 ? (
				<div className="text-center py-12">
					<Text size="4" color="gray" className="block mb-1">No fields yet</Text>
					<Text size="2" color="gray">Click a field type above to get started</Text>
				</div>
			) : (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={form.fields.map((f) => f.id)}
						strategy={verticalListSortingStrategy}
					>
						<div className="flex flex-col gap-2">
							{form.fields.map((field) => (
								<div key={field.id}>
									<FieldCard
										field={field}
										isEditing={editingFieldId === field.id}
										onEdit={() =>
											setEditingFieldId(
												editingFieldId === field.id ? null : field.id,
											)
										}
									/>
									{editingFieldId === field.id && (
										<div className="mt-2">
											<FieldEditor
												field={field}
												onUpdate={updateField}
												onDelete={() => deleteField(field.id)}
												onClose={() => setEditingFieldId(null)}
											/>
										</div>
									)}
								</div>
							))}
						</div>
					</SortableContext>
				</DndContext>
			)}
		</div>
	);
}
