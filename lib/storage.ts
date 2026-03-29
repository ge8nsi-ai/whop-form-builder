import type { Form, FormResponse } from "./types";

const FORMS_PREFIX = "whop_forms_";
const RESPONSES_KEY = (formId: string) => `whop_responses_${formId}`;

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
	} catch {
		// storage full or unavailable
	}
}

export function getForms(ownerId: string): Form[] {
	return safeGet<Form[]>(`${FORMS_PREFIX}${ownerId}`, []);
}

export function getForm(ownerId: string, formId: string): Form | undefined {
	return getForms(ownerId).find((f) => f.id === formId);
}

export function getAllForms(): Form[] {
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

export function saveForm(form: Form): void {
	const key = `${FORMS_PREFIX}${form.companyId}`;
	const forms = safeGet<Form[]>(key, []);
	const idx = forms.findIndex((f) => f.id === form.id);
	if (idx >= 0) {
		forms[idx] = form;
	} else {
		forms.push(form);
	}
	safeSet(key, forms);
}

export function deleteForm(ownerId: string, formId: string): void {
	const key = `${FORMS_PREFIX}${ownerId}`;
	const forms = getForms(ownerId).filter((f) => f.id !== formId);
	safeSet(key, forms);
	safeSet(RESPONSES_KEY(formId), []);
}

export function getResponses(formId: string): FormResponse[] {
	return safeGet<FormResponse[]>(RESPONSES_KEY(formId), []);
}

export function saveResponse(response: FormResponse): void {
	const responses = getResponses(response.formId);
	responses.push(response);
	safeSet(RESPONSES_KEY(response.formId), responses);
}

export function getResponseCount(formId: string): number {
	return getResponses(formId).length;
}
