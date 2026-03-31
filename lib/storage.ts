import type { Form, FormResponse } from "./types";
import { supabase, isReady } from "@/utils/supabase/client";

const FORMS_PREFIX = "whop_forms_";
const RESPONSES_PREFIX = "whop_responses_";

function safeGet<T>(key: string, fallback: T): T {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

function safeSet(key: string, value: any): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {}
}

// ---- Forms ----

export async function getForms(ownerId: string): Promise<Form[]> {
	if (isReady() && supabase) {
		try {
			const { data, error } = await supabase
				.from("forms")
				.select("*")
				.eq("company_id", ownerId)
				.order("created_at", { ascending: false });
			if (!error && data) return data.map(rowToForm);
		} catch {}
	}
	return safeGet<Form[]>(`${FORMS_PREFIX}${ownerId}`, []);
}

export async function getAllForms(): Promise<Form[]> {
	if (isReady() && supabase) {
		try {
			const { data, error } = await supabase
				.from("forms")
				.select("*")
				.order("created_at", { ascending: false });
			if (!error && data) return data.map(rowToForm);
		} catch {}
	}
	if (typeof window === "undefined") return [];
	const all: Form[] = [];
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key && key.startsWith(FORMS_PREFIX)) {
			try {
				const forms = JSON.parse(localStorage.getItem(key) || "[]");
				if (Array.isArray(forms)) all.push(...forms);
			} catch {}
		}
	}
	return all;
}

export async function getForm(ownerId: string, formId: string): Promise<Form | undefined> {
	if (isReady() && supabase) {
		try {
			const { data, error } = await supabase
				.from("forms")
				.select("*")
				.eq("id", formId)
				.single();
			if (!error && data) return rowToForm(data);
		} catch {}
	}
	const forms = await getForms(ownerId);
	return forms.find((f) => f.id === formId);
}

export async function saveForm(form: Form): Promise<void> {
	const key = `${FORMS_PREFIX}${form.companyId}`;
	const existing = safeGet<Form[]>(key, []);
	const idx = existing.findIndex((f) => f.id === form.id);
	if (idx >= 0) existing[idx] = form;
	else existing.push(form);
	safeSet(key, existing);

	if (isReady() && supabase) {
		try {
			await supabase.from("forms").upsert({
				id: form.id,
				company_id: form.companyId,
				title: form.title,
				description: form.description,
				fields: form.fields,
				created_at: new Date(form.createdAt).toISOString(),
				updated_at: new Date(form.updatedAt).toISOString(),
			});
		} catch {}
	}
}

export async function deleteForm(ownerId: string, formId: string): Promise<void> {
	const existing = safeGet<Form[]>(`${FORMS_PREFIX}${ownerId}`, []);
	safeSet(`${FORMS_PREFIX}${ownerId}`, existing.filter((f) => f.id !== formId));
	safeSet(`${RESPONSES_PREFIX}${formId}`, []);

	if (isReady() && supabase) {
		try {
			await supabase.from("form_responses").delete().eq("form_id", formId);
			await supabase.from("forms").delete().eq("id", formId);
		} catch {}
	}
}

// ---- Responses ----

export async function getResponses(formId: string): Promise<FormResponse[]> {
	if (isReady() && supabase) {
		try {
			const { data, error } = await supabase
				.from("form_responses")
				.select("*")
				.eq("form_id", formId)
				.order("submitted_at", { ascending: false });
			if (!error && data) {
				return data.map((r: any) => ({
					id: r.id,
					formId: r.form_id,
					data: r.data,
					submittedAt: new Date(r.submitted_at).getTime(),
				}));
			}
		} catch {}
	}
	return safeGet<FormResponse[]>(`${RESPONSES_PREFIX}${formId}`, []);
}

export async function saveResponse(response: FormResponse): Promise<void> {
	const key = `${RESPONSES_PREFIX}${response.formId}`;
	const existing = safeGet<FormResponse[]>(key, []);
	safeSet(key, [...existing, response]);

	if (isReady() && supabase) {
		try {
			await supabase.from("form_responses").insert({
				id: response.id,
				form_id: response.formId,
				data: response.data,
				submitted_at: new Date(response.submittedAt).toISOString(),
			});
		} catch {}
	}
}

export async function getResponseCount(formId: string): Promise<number> {
	const responses = await getResponses(formId);
	return responses.length;
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
