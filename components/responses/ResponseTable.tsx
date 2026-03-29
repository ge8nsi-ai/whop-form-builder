"use client";

import { Button } from "@whop/react/components";
import type { Form, FormResponse } from "@/lib/types";

interface Props {
	form: Form;
	responses: FormResponse[];
}

export function ResponseTable({ form, responses }: Props) {
	if (responses.length === 0) {
		return (
			<div className="text-center py-12 text-gray-8">
				<p className="text-4 mb-1">No responses yet</p>
				<p className="text-3">Share your form to start collecting responses</p>
			</div>
		);
	}

	function formatValue(fieldId: string, value: any): string {
		if (value === undefined || value === null) return "—";
		if (Array.isArray(value)) return value.join(", ");
		if (typeof value === "number" && form.fields.find((f) => f.id === fieldId)?.type === "rating") {
			return `${value} / 5 ★`;
		}
		return String(value);
	}

	return (
		<div className="overflow-x-auto rounded-xl border border-gray-a4">
			<table className="w-full text-3">
				<thead>
					<tr className="bg-gray-a2">
						<th className="px-4 py-3 text-left font-medium text-gray-11 border-b border-gray-a4">
							#
						</th>
						<th className="px-4 py-3 text-left font-medium text-gray-11 border-b border-gray-a4">
							Date
						</th>
						{form.fields.map((field) => (
							<th
								key={field.id}
								className="px-4 py-3 text-left font-medium text-gray-11 border-b border-gray-a4 whitespace-nowrap"
							>
								{field.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{responses.map((response, idx) => (
						<tr
							key={response.id}
							className="border-b border-gray-a3 last:border-b-0 hover:bg-gray-a1"
						>
							<td className="px-4 py-3 text-gray-10">{idx + 1}</td>
							<td className="px-4 py-3 text-gray-10 whitespace-nowrap">
								{new Date(response.submittedAt).toLocaleDateString()}
							</td>
							{form.fields.map((field) => (
								<td
									key={field.id}
									className="px-4 py-3 text-gray-12 max-w-48 truncate"
								>
									{formatValue(field.id, response.data[field.id])}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
