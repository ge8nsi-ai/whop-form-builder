"use client";

import { useState, useEffect } from "react";
import { Button } from "@whop/react/components";
import { v4 as uuid } from "uuid";
import type { Form } from "@/lib/types";
import { getForms, saveForm, deleteForm as deleteFormFromStorage } from "@/lib/storage";
import { FormBuilder } from "@/components/form-builder";
import { ResponseTable } from "@/components/responses";
import { ResponseStats } from "@/components/responses";
import { ExportButton } from "@/components/responses";
import { getResponses } from "@/lib/storage";

export default function DashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	const [companyId, setCompanyId] = useState<string>("");
	const [forms, setForms] = useState<Form[]>([]);
	const [activeForm, setActiveForm] = useState<Form | null>(null);
	const [tab, setTab] = useState<"build" | "responses">("build");
	useEffect(() => {
		params.then(({ companyId: id }) => {
			setCompanyId(id);
			setForms(getForms(id));
		});
	}, [params]);

	function createForm() {
		const newForm: Form = {
			id: uuid(),
			companyId,
			title: "Untitled Form",
			description: "",
			fields: [],
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		saveForm(newForm);
		setForms(getForms(companyId));
		setActiveForm(newForm);
		setTab("build");
	}

	function handleFormChange(updated: Form) {
		setActiveForm(updated);
		setForms(getForms(companyId));
	}

	function deleteForm(formId: string) {
		deleteFormFromStorage(companyId, formId);
		setForms(getForms(companyId));
		if (activeForm?.id === formId) {
			setActiveForm(null);
		}
	}

	if (!companyId) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-4 text-gray-8">Loading...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex">
			<aside className="w-64 border-r border-gray-a4 bg-gray-a1 p-4 flex flex-col gap-3 flex-shrink-0">
				<h2 className="text-5 font-bold text-gray-12 px-1">Your Forms</h2>
				<Button variant="classic" size="2" onClick={createForm}>
					+ New Form
				</Button>
				<div className="flex flex-col gap-1 mt-2 overflow-y-auto flex-1">
					{forms.length === 0 ? (
						<p className="text-3 text-gray-8 px-1">No forms yet</p>
					) : (
						forms.map((form) => (
							<div
								key={form.id}
								className={`group flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors ${
									activeForm?.id === form.id
										? "bg-blue-a3 text-blue-11"
										: "hover:bg-gray-a3 text-gray-11"
								}`}
								onClick={() => {
									setActiveForm(form);
									setTab("build");
								}}
							>
								<span className="text-3 truncate flex-1">{form.title}</span>
								<span className="text-2 text-gray-8 ml-2">
									{form.fields.length} fields
								</span>
							</div>
						))
					)}
				</div>
			</aside>

			<main className="flex-1 p-6 overflow-y-auto">
				{!activeForm ? (
					<div className="flex flex-col items-center justify-center h-full gap-4 text-center">
						<div className="text-8">📋</div>
						<h2 className="text-6 font-bold text-gray-12">
							Form Builder
						</h2>
						<p className="text-4 text-gray-9 max-w-md">
							Create a form or select one from the sidebar to start
							building.
						</p>
						<Button variant="classic" size="3" onClick={createForm}>
							Create Your First Form
						</Button>
					</div>
				) : (
					<div className="max-w-3xl mx-auto">
						<div className="flex items-center justify-between mb-6">
							<div className="flex gap-1 bg-gray-a2 rounded-lg p-1">
								<button
									type="button"
									onClick={() => setTab("build")}
									className={`px-4 py-1.5 rounded-md text-3 font-medium transition-colors cursor-pointer border-none ${
										tab === "build"
											? "bg-gray-a4 text-gray-12"
											: "text-gray-9 hover:text-gray-11 bg-transparent"
									}`}
								>
									Build
								</button>
								<button
									type="button"
									onClick={() => setTab("responses")}
									className={`px-4 py-1.5 rounded-md text-3 font-medium transition-colors cursor-pointer border-none ${
										tab === "responses"
											? "bg-gray-a4 text-gray-12"
											: "text-gray-9 hover:text-gray-11 bg-transparent"
									}`}
								>
									Responses ({getResponses(activeForm.id).length})
								</button>
							</div>
							<div className="flex gap-2">
								{tab === "responses" && (
									<ExportButton
										form={activeForm}
										responses={getResponses(activeForm.id)}
									/>
								)}
								<Button
									variant="ghost"
									size="2"
									onClick={() => {
										if (
											confirm(
												`Delete "${activeForm.title}"? This cannot be undone.`,
											)
										) {
											deleteForm(activeForm.id);
										}
									}}
								>
									Delete
								</Button>
							</div>
						</div>

						{tab === "build" ? (
							<FormBuilder
								form={activeForm}
								onFormChange={handleFormChange}
							/>
						) : (
							<div className="flex flex-col gap-6">
								<ResponseStats
									form={activeForm}
									responses={getResponses(activeForm.id)}
								/>
								<ResponseTable
									form={activeForm}
									responses={getResponses(activeForm.id)}
								/>
							</div>
						)}
					</div>
				)}
			</main>
		</div>
	);
}
