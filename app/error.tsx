"use client";

import { useEffect } from "react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("App error:", error);
	}, [error]);

	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="max-w-md text-center">
				<h2 className="text-6 font-bold text-gray-12 mb-3">Something went wrong</h2>
				<p className="text-3 text-gray-9 mb-6">
					{error.message || "An unexpected error occurred."}
				</p>
				<button
					type="button"
					onClick={reset}
					className="px-4 py-2 rounded-lg bg-blue-9 text-white text-3 font-medium cursor-pointer border-none"
				>
					Try again
				</button>
			</div>
		</div>
	);
}
