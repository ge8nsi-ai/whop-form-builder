import type { NextRequest } from "next/server";
import { whopsdk } from "@/lib/whop-sdk";

export async function POST(request: NextRequest): Promise<Response> {
	const requestBodyText = await request.text();
	const headers = Object.fromEntries(request.headers);
	const webhookData = whopsdk.webhooks.unwrap(requestBodyText, { headers });

	if (webhookData.type === "payment.succeeded") {
		console.log("[PAYMENT SUCCEEDED]", webhookData.data);
	}

	return new Response("OK", { status: 200 });
}
