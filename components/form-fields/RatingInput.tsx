"use client";

import { useState } from "react";
import { Text } from "@whop/react/components";

interface Props {
	label: string;
	required: boolean;
	value: number;
	onChange: (value: number) => void;
}

export function RatingInput({ label, required, value, onChange }: Props) {
	const [hovered, setHovered] = useState(0);

	return (
		<fieldset className="flex flex-col gap-1.5 border-none p-0 m-0">
			<legend className="text-2 font-medium text-gray-11">
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
						className="text-6 transition-all duration-150 hover:scale-125 cursor-pointer bg-transparent border-none p-0"
						style={{
							color: star <= (hovered || value) ? "var(--amber-9)" : "var(--gray-8)",
							filter: star <= (hovered || value) ? "drop-shadow(0 0 4px var(--amber-a5))" : "none",
						}}
					>
						{star <= (hovered || value) ? "★" : "☆"}
					</button>
				))}
			</div>
		</fieldset>
	);
}
