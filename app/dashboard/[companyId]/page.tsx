"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Card, Heading, Text, Badge, Separator } from "@whop/react/components";
import { v4 as uuid } from "uuid";
import type { Form } from "@/lib/types";
import { getForms, saveForm, deleteForm as deleteFormFromStorage, getResponses } from "@/lib/storage";
import { FormBuilder } from "@/components/form-builder";
import { ResponseTable, ResponseStats, ExportButton } from "@/components/responses";

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
		}
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

	return (
		<div className="min-h-screen flex">
		<aside className="w-64 border-r border-gray-a4 bg-gray-a1 p-4 flex flex-col gap-3 flex-shrink-0">
			<Heading size="4" weight="bold" className="px-1">Your Forms</Heading>
			<Button variant="classic" size="2" onClick={createForm}>
				+ New Form
			</Button>
			<Link href={`/admin/${companyId}`}>
				<Button variant="soft" size="2" className="w-full">
					⚙ Admin Panel
				</Button>
			</Link>
			<Separator size="4" />
				<div className="flex flex-col gap-1 mt-1 overflow-y-auto flex-1">
					{forms.length === 0 ? (
						<Text size="2" color="gray" className="px-1">No forms yet</Text>
					) : (
						forms.map((form) => {
							const count = getResponses(form.id).length;
							return (
								<div
									key={form.id}
									className={`group flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
										activeForm?.id === form.id
											? "bg-blue-a3"
											: "hover:bg-gray-a3"
									}`}
									onClick={() => {
										setActiveForm(form);
										setTab("build");
									}}
								>
									<div className="flex-1 min-w-0">
										<Text
											size="2"
											weight={activeForm?.id === form.id ? "medium" : "regular"}
											className="block truncate"
										>
											{form.title}
										</Text>
										<div className="flex gap-1.5 mt-0.5">
											<Text size="1" color="gray">
												{form.fields.length}f
											</Text>
											<Text size="1" color="gray">·</Text>
											<Text size="1" color={count > 0 ? "blue" : "gray"}>
												{count}r
											</Text>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			</aside>

			<main className="flex-1 p-6 overflow-y-auto">
				{!activeForm ? (
					<div className="flex flex-col items-center justify-center h-full gap-4 text-center">
						<div className="w-16 h-16 rounded-2xl bg-gray-a3 flex items-center justify-center text-7">
							📋
						</div>
						<Heading size="5" weight="bold">Form Builder</Heading>
						<Text size="3" color="gray" className="max-w-md">
							Create a form or select one from the sidebar to start building.
						</Text>
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
									variant="soft"
									color="red"
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
