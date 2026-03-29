"use client";

interface Props {
	formTitle: string;
}

export function SuccessScreen({ formTitle }: Props) {
	return (
		<div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
			<div className="text-8">✅</div>
			<h2 className="text-7 font-bold text-gray-12">Response Submitted!</h2>
			<p className="text-4 text-gray-10 max-w-md">
				Thank you for completing &quot;{formTitle}&quot;. Your response has been
				recorded.
			</p>
		</div>
	);
}
