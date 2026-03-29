import type { Form, FormResponse } from "./types";

const FORMS_KEY = (companyId: string) => `whop_forms_${companyId}`;
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

export function getForms(companyId: string): Form[] {
	return safeGet<Form[]>(FORMS_KEY(companyId), []);
}

export function getForm(companyId: string, formId: string): Form | undefined {
	return getForms(companyId).find((f) => f.id === formId);
}

export function saveForm(form: Form): void {
	const forms = getForms(form.companyId);
	const idx = forms.findIndex((f) => f.id === form.id);
	if (idx >= 0) {
		forms[idx] = form;
	} else {
		forms.push(form);
	}
	safeSet(FORMS_KEY(form.companyId), forms);
}

export function deleteForm(companyId: string, formId: string): void {
	const forms = getForms(companyId).filter((f) => f.id !== formId);
	safeSet(FORMS_KEY(companyId), forms);
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
