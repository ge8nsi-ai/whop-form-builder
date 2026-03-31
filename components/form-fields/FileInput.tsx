"use client";

import { useState, useRef } from "react";
import { Text, Badge, Button } from "@whop/react/components";

interface Props {
	label: string;
	required: boolean;
	value: string | null;
	onChange: (value: string | null) => void;
}

export function FileInput({ label, required, value, onChange }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [fileName, setFileName] = useState<string | null>(null);
	const [preview, setPreview] = useState<string | null>(null);

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) {
			onChange(null);
			setFileName(null);
			setPreview(null);
			return;
		}

		setFileName(file.name);

		if (file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result as string);
				onChange(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			// For non-image files, just store the file name
			setPreview(null);
			onChange(file.name);
		}
	}

	function clearFile() {
		onChange(null);
		setFileName(null);
		setPreview(null);
		if (inputRef.current) inputRef.current.value = "";
	}

	return (
		<div className="flex flex-col gap-1.5">
			<Text as="label" size="2" weight="medium" color="gray">
				{label}
				{required && <span className="text-red-9 ml-1">*</span>}
			</Text>

			{value ? (
				<div className="border border-gray-a4 rounded-lg p-3 bg-gray-a1">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<span className="text-4">📎</span>
							<div>
								{fileName && (
									<Text size="2" weight="medium" className="block">
										{fileName}
									</Text>
								)}
								{preview ? (
									<Text size="1" color="green">Image uploaded</Text>
								) : (
									<Text size="1" color="gray">File selected</Text>
								)}
							</div>
						</div>
						<Button variant="soft" size="1" onClick={clearFile}>
							Remove
						</Button>
					</div>
					{preview && (
						<img
							src={preview}
							alt="Preview"
							className="mt-3 rounded-lg max-h-40 object-cover"
						/>
					)}
				</div>
			) : (
				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					className="border-2 border-dashed border-gray-a4 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-a2 hover:border-gray-a5 transition-colors bg-transparent"
				>
					<span className="text-5 block mb-2 opacity-60">📁</span>
					<Text size="2" color="gray" className="block">
						Click to upload a file
					</Text>
					<Text size="1" color="gray" className="block mt-1">
						Images, documents, or any file
					</Text>
				</button>
			)}

			<input
				ref={inputRef}
				type="file"
				onChange={handleFileChange}
				accept="*/*"
				className="hidden"
			/>
		</div>
	);
}
