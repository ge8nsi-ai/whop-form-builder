"use client";

import { useState, useEffect } from "react";
import { Card, Heading, Text, Button } from "@whop/react/components";
import type { Form } from "@/lib/types";
import { getAllForms } from "@/lib/storage";
import { FormRenderer } from "@/components/form-viewer";

export default function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	const [forms, setForms] = useState<Form[]>([]);
	const [selectedForm, setSelectedForm] = useState<Form | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getAllForms().then((data) => {
			setForms(data);
			setLoading(false);
		});
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="flex flex-col items-center gap-3">
					<div className="w-8 h-8 border-2 border-blue-a8 border-t-transparent rounded-full animate-spin" />
					<Text color="gray">Loading forms...</Text>
				</div>
			</div>
		);
	}

	if (selectedForm) {
		return (
			<div className="min-h-screen py-8 px-4">
				<div className="max-w-2xl mx-auto">
					<Button
						variant="ghost"
						size="2"
						onClick={() => setSelectedForm(null)}
						className="mb-4"
					>
						Back to forms
					</Button>
					<Card className="p-6">
						<FormRenderer form={selectedForm} />
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen py-8 px-4">
			<div className="max-w-2xl mx-auto">
				<Heading size="6" weight="bold" className="mb-2">Forms</Heading>
				<Text size="3" color="gray" className="mb-6 block">
					Select a form to fill out.
				</Text>

				{forms.length === 0 ? (
					<Card className="p-12 text-center">
						<Heading size="4" weight="semi-bold" className="mb-2">
							No forms available
						</Heading>
						<Text size="2" color="gray">
							The creator hasn&apos;t published any forms yet.
						</Text>
					</Card>
				) : (
					<div className="flex flex-col gap-3">
						{forms.map((form) => (
							<Card
								key={form.id}
								className="p-5 cursor-pointer hover:bg-gray-a2 transition-colors"
								onClick={() => setSelectedForm(form)}
							>
								<Heading size="3" weight="semi-bold" className="mb-1">
									{form.title}
								</Heading>
								{form.description && (
									<Text size="2" color="gray" className="block mb-2">
										{form.description}
									</Text>
								)}
								<Text size="1" color="gray">
									{form.fields.length} fields
								</Text>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
