import type { Form, FormResponse } from "./types";
import { supabase } from "@/utils/supabase/client";

// ---- Forms ----

export async function getForms(ownerId: string): Promise<Form[]> {
	const { data, error } = await supabase
		.from("forms")
		.select("*")
		.eq("company_id", ownerId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("getForms error:", error);
		return [];
	}

	return (data || []).map(rowToForm);
}

export async function getAllForms(): Promise<Form[]> {
	const { data, error } = await supabase
		.from("forms")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("getAllForms error:", error);
		return [];
	}

	return (data || []).map(rowToForm);
}

export async function getForm(ownerId: string, formId: string): Promise<Form | undefined> {
	const { data, error } = await supabase
		.from("forms")
		.select("*")
		.eq("id", formId)
		.single();

	if (error) return undefined;
	return rowToForm(data);
}

export async function saveForm(form: Form): Promise<void> {
	const { error } = await supabase
		.from("forms")
		.upsert({
			id: form.id,
			company_id: form.companyId,
			title: form.title,
			description: form.description,
			fields: form.fields,
			created_at: new Date(form.createdAt).toISOString(),
			updated_at: new Date(form.updatedAt).toISOString(),
		});

	if (error) console.error("saveForm error:", error);
}

export async function deleteForm(ownerId: string, formId: string): Promise<void> {
	await supabase.from("form_responses").delete().eq("form_id", formId);
	const { error } = await supabase.from("forms").delete().eq("id", formId);
	if (error) console.error("deleteForm error:", error);
}

// ---- Responses ----

export async function getResponses(formId: string): Promise<FormResponse[]> {
	const { data, error } = await supabase
		.from("form_responses")
		.select("*")
		.eq("form_id", formId)
		.order("submitted_at", { ascending: false });

	if (error) {
		console.error("getResponses error:", error);
		return [];
	}

	return (data || []).map((r: any) => ({
		id: r.id,
		formId: r.form_id,
		data: r.data,
		submittedAt: new Date(r.submitted_at).getTime(),
	}));
}

export async function saveResponse(response: FormResponse): Promise<void> {
	const { error } = await supabase
		.from("form_responses")
		.insert({
			id: response.id,
			form_id: response.formId,
			data: response.data,
			submitted_at: new Date(response.submittedAt).toISOString(),
		});

	if (error) console.error("saveResponse error:", error);
}

export async function getResponseCount(formId: string): Promise<number> {
	const { count, error } = await supabase
		.from("form_responses")
		.select("*", { count: "exact", head: true })
		.eq("form_id", formId);

	if (error) return 0;
	return count || 0;
}

// ---- Helpers ----

function rowToForm(row: any): Form {
	return {
		id: row.id,
		companyId: row.company_id,
		title: row.title,
		description: row.description || "",
		fields: row.fields || [],
		createdAt: new Date(row.created_at).getTime(),
		updatedAt: new Date(row.updated_at).getTime(),
	};
}
