"use client";

import { useState } from "react";

interface Props {
	label: string;
	required: boolean;
	value: number;
	onChange: (value: number) => void;
}

export function RatingInput({ label, required, value, onChange }: Props) {
	const [hovered, setHovered] = useState(0);

	return (
		<fieldset className="flex flex-col gap-1.5">
			<legend className="text-3 font-medium text-gray-12">
				{label}
				{required && <span className="text-red-9 ml-1">*</span>}
			</legend>
			<div className="flex gap-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type="button"
						onClick={() => onChange(star)}
						onMouseEnter={() => setHovered(star)}
						onMouseLeave={() => setHovered(0)}
						className="text-6 transition-transform hover:scale-110 cursor-pointer bg-transparent border-none p-0"
					>
						{star <= (hovered || value) ? "★" : "☆"}
					</button>
				))}
			</div>
		</fieldset>
	);
}
