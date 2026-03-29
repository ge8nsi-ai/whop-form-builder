"use client";

import { Button, Card, Heading, Text } from "@whop/react/components";

interface Props {
	formTitle: string;
}

export function SuccessScreen({ formTitle }: Props) {
	return (
		<div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
			<div className="w-16 h-16 rounded-full bg-green-a3 flex items-center justify-center text-7">
				✓
			</div>
			<Heading size="6" weight="bold">
				Response Submitted!
			</Heading>
			<Text size="3" color="gray" className="max-w-md">
				Thank you for completing &quot;{formTitle}&quot;. Your response has been
				recorded.
			</Text>
		</div>
	);
}
