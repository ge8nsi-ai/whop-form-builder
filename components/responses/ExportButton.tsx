"use client";

import { Button } from "@whop/react/components";
import type { Form, FormResponse } from "@/lib/types";

interface Props {
	form: Form;
	responses: FormResponse[];
}

export function ExportButton({ form, responses }: Props) {
	function handleExport() {
		if (responses.length === 0) return;

		const headers = [
			"Response #",
			"Submitted At",
			...form.fields.map((f) => f.label),
		];

		const rows = responses.map((response, idx) => {
			const values = form.fields.map((field) => {
				const val = response.data[field.id];
				if (val === undefined || val === null) return "";
				if (Array.isArray(val)) return val.join("; ");
				return String(val);
			});
			return [
				String(idx + 1),
				new Date(response.submittedAt).toISOString(),
				...values,
			];
		});

		const escapeCsv = (v: string) =>
			v.includes(",") || v.includes('"') || v.includes("\n")
				? `"${v.replace(/"/g, '""')}"`
				: v;

		const csv = [
			headers.map(escapeCsv).join(","),
			...rows.map((row) => row.map(escapeCsv).join(",")),
		].join("\n");

		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${form.title.replace(/[^a-z0-9]/gi, "_")}_responses.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<Button
			variant="ghost"
			size="2"
			onClick={handleExport}
			disabled={responses.length === 0}
		>
			Export CSV
		</Button>
	);
}
