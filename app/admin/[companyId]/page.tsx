"use client";

import { useState, useEffect } from "react";
import { Button } from "@whop/react/components";
import { v4 as uuid } from "uuid";
import type { Form } from "@/lib/types";
import { getForms, saveForm, deleteForm as deleteFormFromStorage, getResponses } from "@/lib/storage";
import { FormBuilder } from "@/components/form-builder";
import { ResponseTable, ResponseStats, ExportButton } from "@/components/responses";

export default function AdminPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	const [companyId, setCompanyId] = useState<string>("");
	const [forms, setForms] = useState<Form[]>([]);
	const [activeForm, setActiveForm] = useState<Form | null>(null);
	const [tab, setTab] = useState<"build" | "responses">("build");
	const [view, setView] = useState<"list" | "editor">("list");

	useEffect(() => {
		params.then(({ companyId: id }) => {
			setCompanyId(id);
			setForms(getForms(id));
		});
	}, [params]);

	function refresh() {
		setForms(getForms(companyId));
	}

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
		refresh();
		setActiveForm(newForm);
		setTab("build");
		setView("editor");
	}

	function handleFormChange(updated: Form) {
		setActiveForm(updated);
		refresh();
	}

	function deleteForm(formId: string) {
		deleteFormFromStorage(companyId, formId);
		refresh();
		if (activeForm?.id === formId) {
			setActiveForm(null);
			setView("list");
		}
	}

	function duplicateForm(form: Form) {
		const dup: Form = {
			...form,
			id: uuid(),
			title: `${form.title} (copy)`,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		saveForm(dup);
		refresh();
	}

	if (!companyId) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-4 text-gray-8">Loading...</p>
			</div>
		);
	}

	// List view — all forms overview
	if (view === "list") {
		return (
			<div className="min-h-screen p-6">
				<div className="max-w-4xl mx-auto">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h1 className="text-8 font-bold text-gray-12">Admin Panel</h1>
							<p className="text-3 text-gray-9 mt-1">
								{forms.length} form{forms.length !== 1 ? "s" : ""} · {companyId}
							</p>
						</div>
						<Button variant="classic" size="3" onClick={createForm}>
							+ New Form
						</Button>
					</div>

					{forms.length === 0 ? (
						<div className="text-center py-20 border border-dashed border-gray-a6 rounded-2xl">
							<div className="text-8 mb-4">📋</div>
							<h2 className="text-5 font-semibold text-gray-11 mb-2">No forms yet</h2>
							<p className="text-3 text-gray-9 mb-6">Create your first form to get started.</p>
							<Button variant="classic" size="3" onClick={createForm}>
								Create Form
							</Button>
						</div>
					) : (
						<div className="grid gap-3">
							{forms.map((form) => {
								const responses = getResponses(form.id);
								return (
									<div
										key={form.id}
										className="border border-gray-a4 rounded-xl p-5 bg-gray-a1 hover:bg-gray-a2 transition-colors"
									>
										<div className="flex items-start justify-between">
											<div
												className="flex-1 cursor-pointer"
												onClick={() => {
													setActiveForm(form);
													setTab("build");
													setView("editor");
												}}
											>
												<h3 className="text-5 font-semibold text-gray-12">
													{form.title}
												</h3>
												{form.description && (
													<p className="text-3 text-gray-10 mt-1">
														{form.description}
													</p>
												)}
												<div className="flex gap-4 mt-3 text-2 text-gray-9">
													<span>{form.fields.length} fields</span>
													<span>{responses.length} responses</span>
													<span>
														Updated{" "}
														{new Date(form.updatedAt).toLocaleDateString()}
													</span>
												</div>
											</div>
											<div className="flex gap-2 ml-4">
												<Button
													variant="ghost"
													size="2"
													onClick={() => duplicateForm(form)}
												>
													Duplicate
												</Button>
												<Button
													variant="ghost"
													size="2"
													onClick={() => {
														setActiveForm(form);
														setTab("responses");
														setView("editor");
													}}
												>
													Responses
												</Button>
												<Button
													variant="ghost"
													size="2"
													onClick={() => {
														if (
															confirm(
																`Delete "${form.title}"? This cannot be undone.`
															)
														) {
															deleteForm(form.id);
														}
													}}
												>
													Delete
												</Button>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		);
	}

	// Editor view
	return (
		<div className="min-h-screen p-6">
			<div className="max-w-3xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<button
						type="button"
						onClick={() => {
							setView("list");
							setActiveForm(null);
							refresh();
						}}
						className="text-3 text-blue-10 hover:text-blue-11 bg-transparent border-none cursor-pointer"
					>
						← Back to all forms
					</button>
					<div className="flex gap-2">
						{activeForm && (
							<ExportButton
								form={activeForm}
								responses={getResponses(activeForm.id)}
							/>
						)}
					</div>
				</div>

				{activeForm && (
					<>
						<div className="flex gap-1 bg-gray-a2 rounded-lg p-1 mb-6">
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
					</>
				)}
			</div>
		</div>
	);
}
