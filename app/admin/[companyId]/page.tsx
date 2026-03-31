"use client";

import { useState, useEffect } from "react";
import { Button, Card, Heading, Text, Badge, IconButton, Separator } from "@whop/react/components";
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
	const [responses, setResponses] = useState<any[]>([]);
	const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});

	useEffect(() => {
		params.then(({ companyId: id }) => {
			setCompanyId(id);
			loadForms(id);
		});
	}, [params]);

	async function loadForms(id: string) {
		const data = await getForms(id);
		setForms(data);
		const counts: Record<string, number> = {};
		for (const form of data) {
			counts[form.id] = (await getResponses(form.id)).length;
		}
		setResponseCounts(counts);
	}

	async function refresh() {
		await loadForms(companyId);
	}

	async function createForm() {
		const newForm: Form = {
			id: uuid(),
			companyId,
			title: "Untitled Form",
			description: "",
			fields: [],
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		await saveForm(newForm);
		await refresh();
		setActiveForm(newForm);
		setTab("build");
		setView("editor");
	}

	async function handleFormChange(updated: Form) {
		setActiveForm(updated);
		await refresh();
	}

	async function handleDelete(formId: string) {
		await deleteFormFromStorage(companyId, formId);
		await refresh();
		if (activeForm?.id === formId) {
			setActiveForm(null);
			setView("list");
		}
	}

	async function duplicateForm(form: Form) {
		const dup: Form = {
			...form,
			id: uuid(),
			title: `${form.title} (copy)`,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		await saveForm(dup);
		await refresh();
	}

	async function loadResponses(formId: string) {
		const data = await getResponses(formId);
		setResponses(data);
	}

	if (!companyId) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="flex flex-col items-center gap-3">
					<div className="w-8 h-8 border-2 border-blue-a8 border-t-transparent rounded-full animate-spin" />
					<Text color="gray">Loading...</Text>
				</div>
			</div>
		);
	}

	// List view
	if (view === "list") {
		return (
			<div className="min-h-screen p-6">
				<div className="max-w-4xl mx-auto">
					<div className="flex items-center justify-between mb-8">
						<div>
							<Heading size="8" weight="bold">Admin Panel</Heading>
							<Text size="3" color="gray" className="mt-1 block">
								{forms.length} form{forms.length !== 1 ? "s" : ""} / {companyId}
							</Text>
						</div>
						<Button variant="classic" size="3" onClick={createForm}>
							+ New Form
						</Button>
					</div>

					{forms.length === 0 ? (
						<Card className="p-12 text-center border-dashed">
							<Heading size="4" weight="semi-bold" className="mb-2">No forms yet</Heading>
							<Text size="2" color="gray" className="mb-6 block">
								Create your first form to get started.
							</Text>
							<Button variant="classic" size="3" onClick={createForm}>
								Create Form
							</Button>
						</Card>
					) : (
						<div className="grid gap-3">
							{forms.map((form) => {
								const count = responseCounts[form.id] ?? 0;
								return (
									<Card
										key={form.id}
										className="p-5 hover:bg-gray-a2 transition-colors"
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
												<Heading size="4" weight="semi-bold" className="mb-1">
													{form.title}
												</Heading>
												{form.description && (
													<Text size="2" color="gray" className="block mb-2">
														{form.description}
													</Text>
												)}
												<div className="flex gap-2">
													<Badge variant="soft" size="1" color="gray">
														{form.fields.length} fields
													</Badge>
													<Badge variant="soft" size="1" color={count > 0 ? "blue" : "gray"}>
														{count} responses
													</Badge>
												</div>
											</div>
											<div className="flex gap-2 ml-4">
												<Button
													variant="soft"
													size="1"
													onClick={() => duplicateForm(form)}
												>
													Duplicate
												</Button>
												<Button
													variant="soft"
													size="1"
													onClick={() => {
														setActiveForm(form);
														setTab("responses");
														setView("editor");
														loadResponses(form.id);
													}}
												>
													Responses
												</Button>
												<Button
													variant="soft"
													color="red"
													size="1"
													onClick={() => {
														if (confirm(`Delete "${form.title}"?`)) {
															handleDelete(form.id);
														}
													}}
												>
													Delete
												</Button>
											</div>
										</div>
									</Card>
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
					<Button
						variant="ghost"
						size="2"
						onClick={() => {
							setView("list");
							setActiveForm(null);
							refresh();
						}}
					>
						All Forms
					</Button>
					<div className="flex gap-2">
						{activeForm && (
							<ExportButton
								form={activeForm}
								responses={responses}
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
								onClick={() => {
									setTab("responses");
									loadResponses(activeForm.id);
								}}
								className={`px-4 py-1.5 rounded-md text-3 font-medium transition-colors cursor-pointer border-none ${
									tab === "responses"
										? "bg-gray-a4 text-gray-12"
										: "text-gray-9 hover:text-gray-11 bg-transparent"
								}`}
							>
								Responses ({responseCounts[activeForm.id] ?? 0})
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
									responses={responses}
								/>
								<ResponseTable
									form={activeForm}
									responses={responses}
								/>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
