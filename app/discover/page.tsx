import { Heading, Text, Card } from "@whop/react/components";

export default function DiscoverPage() {
	return (
		<div className="min-h-screen py-16 px-4">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-12">
					<Heading size="8" weight="bold" className="mb-4">
						Form Builder
					</Heading>
					<Text size="4" color="gray" className="block max-w-2xl mx-auto">
						Build and share forms with your community. Zero backend, zero cost.
					</Text>
				</div>

				<Card className="p-8 mb-10">
					<Text size="3" color="gray" className="block mb-3">
						Create forms with 9 field types. Drag and drop to reorder. View
						responses and export to CSV. All data stored in the browser.
					</Text>
					<Text size="2" color="gray">
						💡 Use the dashboard to build forms, then share the experience link
						with your community to collect responses.
					</Text>
				</Card>

				<div className="grid md:grid-cols-3 gap-4 mb-10">
					<Card className="p-5">
						<Heading size="3" weight="semi-bold" className="mb-2">
							9 Field Types
						</Heading>
						<Text size="2" color="gray">
							Text, email, number, dropdown, radio, checkbox, date, rating,
							and long text.
						</Text>
					</Card>
					<Card className="p-5">
						<Heading size="3" weight="semi-bold" className="mb-2">
							Drag & Drop
						</Heading>
						<Text size="2" color="gray">
							Reorder fields with intuitive drag-and-drop. Edit labels,
							options, and required status.
						</Text>
					</Card>
					<Card className="p-5">
						<Heading size="3" weight="semi-bold" className="mb-2">
							Export CSV
						</Heading>
						<Text size="2" color="gray">
							View all responses in a table with basic analytics. Export to
							CSV with one click.
						</Text>
					</Card>
				</div>

				<div className="grid md:grid-cols-2 gap-4">
					<Card className="p-5">
						<Heading size="3" weight="semi-bold" className="mb-2">
							Zero Backend
						</Heading>
						<Text size="2" color="gray">
							All form data is stored in the browser&apos;s localStorage.
							No API calls, no database, no server costs.
						</Text>
					</Card>
					<Card className="p-5">
						<Heading size="3" weight="semi-bold" className="mb-2">
							Free Forever
						</Heading>
						<Text size="2" color="gray">
							Deploy on Vercel&apos;s free tier. No paid services
							required. Build unlimited forms with unlimited fields.
						</Text>
					</Card>
				</div>
			</div>
		</div>
	);
}
