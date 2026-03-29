"use client";

import { useState, useEffect } from "react";
import type { Form } from "@/lib/types";
import { getForms } from "@/lib/storage";
import { FormRenderer } from "@/components/form-viewer";

export default function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	const [companyId, setCompanyId] = useState<string>("");
	const [forms, setForms] = useState<Form[]>([]);
	const [selectedForm, setSelectedForm] = useState<Form | null>(null);

	useEffect(() => {
		params.then(({ experienceId }) => {
			// In a real app, experienceId maps to a companyId.
			// For client-side, we use experienceId as the companyId key.
			setCompanyId(experienceId);
			setForms(getForms(experienceId));
		});
	}, [params]);

	if (selectedForm) {
		return (
			<div className="min-h-screen py-8 px-4">
				<div className="max-w-2xl mx-auto">
					<button
						type="button"
						onClick={() => setSelectedForm(null)}
						className="text-3 text-blue-10 hover:text-blue-11 mb-4 bg-transparent border-none cursor-pointer"
					>
						← Back to forms
					</button>
					<div className="rounded-2xl border border-gray-a4 bg-gray-a1 p-6">
						<FormRenderer form={selectedForm} />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen py-8 px-4">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-7 font-bold text-gray-12 mb-2">Forms</h1>
				<p className="text-4 text-gray-10 mb-6">
					Select a form to fill out.
				</p>

				{forms.length === 0 ? (
					<div className="text-center py-16 text-gray-8">
						<div className="text-8 mb-4">📋</div>
						<p className="text-4">No forms available yet.</p>
						<p className="text-3 mt-1">
							The creator hasn&apos;t published any forms.
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{forms.map((form) => (
							<div
								key={form.id}
								className="rounded-xl border border-gray-a4 bg-gray-a1 p-4 cursor-pointer hover:bg-gray-a2 transition-colors"
								onClick={() => setSelectedForm(form)}
							>
								<h3 className="text-4 font-semibold text-gray-12">
									{form.title}
								</h3>
								{form.description && (
									<p className="text-3 text-gray-10 mt-1">
										{form.description}
									</p>
								)}
								<p className="text-2 text-gray-8 mt-2">
									{form.fields.length} fields
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
