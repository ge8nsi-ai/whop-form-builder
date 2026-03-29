"use client";

import { Table, Text } from "@whop/react/components";
import type { Form, FormResponse } from "@/lib/types";

interface Props {
	form: Form;
	responses: FormResponse[];
}

export function ResponseTable({ form, responses }: Props) {
	if (responses.length === 0) {
		return (
			<div className="text-center py-12">
				<Text size="4" color="gray" className="block mb-1">No responses yet</Text>
				<Text size="2" color="gray">Share your form to start collecting responses</Text>
			</div>
		);
	}

	function formatValue(fieldId: string, value: any): string {
		if (value === undefined || value === null) return "—";
		if (Array.isArray(value)) return value.join(", ");
		if (typeof value === "number" && form.fields.find((f) => f.id === fieldId)?.type === "rating") {
			return `${"★".repeat(value)}${"☆".repeat(5 - value)}`;
		}
		return String(value);
	}

	return (
		<div className="overflow-x-auto rounded-xl border border-gray-a4">
			<Table.Root variant="surface">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
						{form.fields.map((field) => (
							<Table.ColumnHeaderCell key={field.id}>
								{field.label}
							</Table.ColumnHeaderCell>
						))}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{responses.map((response, idx) => (
						<Table.Row key={response.id}>
							<Table.Cell>
								<Text size="2" color="gray">{idx + 1}</Text>
							</Table.Cell>
							<Table.Cell>
								<Text size="2" color="gray">
									{new Date(response.submittedAt).toLocaleDateString()}
								</Text>
							</Table.Cell>
							{form.fields.map((field) => (
								<Table.Cell key={field.id}>
									<Text size="2" className="max-w-48 truncate block">
										{formatValue(field.id, response.data[field.id])}
									</Text>
								</Table.Cell>
							))}
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</div>
	);
}
