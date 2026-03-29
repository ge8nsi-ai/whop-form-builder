"use client";

import type { Form, FormResponse } from "@/lib/types";

interface Props {
	form: Form;
	responses: FormResponse[];
}

export function ResponseStats({ form, responses }: Props) {
	const total = responses.length;

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const todayCount = responses.filter(
		(r) => r.submittedAt >= today.getTime(),
	).length;

	const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
	const weekCount = responses.filter(
		(r) => r.submittedAt >= weekAgo,
	).length;

	const ratingFields = form.fields.filter((f) => f.type === "rating");
	const avgRatings = ratingFields.map((field) => {
		const values = responses
			.map((r) => r.data[field.id])
			.filter((v) => typeof v === "number");
		const avg =
			values.length > 0
				? values.reduce((a, b) => a + b, 0) / values.length
				: 0;
		return { label: field.label, avg: avg.toFixed(1), count: values.length };
	});

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
			<StatCard label="Total Responses" value={total} />
			<StatCard label="Today" value={todayCount} />
			<StatCard label="This Week" value={weekCount} />
			<StatCard label="Fields" value={form.fields.length} />
			{avgRatings.map((r) => (
				<StatCard
					key={r.label}
					label={`Avg: ${r.label}`}
					value={`${r.avg} ★`}
					sub={`${r.count} ratings`}
				/>
			))}
		</div>
	);
}

function StatCard({
	label,
	value,
	sub,
}: {
	label: string;
	value: string | number;
	sub?: string;
}) {
	return (
		<div className="rounded-xl border border-gray-a4 bg-gray-a1 p-4">
			<div className="text-2 text-gray-9 uppercase tracking-wider mb-1">
				{label}
			</div>
			<div className="text-6 font-bold text-gray-12">{value}</div>
			{sub && <div className="text-2 text-gray-8 mt-0.5">{sub}</div>}
		</div>
	);
}
