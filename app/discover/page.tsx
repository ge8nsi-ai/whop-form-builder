export default function DiscoverPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
			<div className="max-w-4xl mx-auto px-4 py-16">
				<h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
					Form Builder
				</h1>
				<div className="bg-white rounded-xl p-8 shadow-md text-center mb-16">
					<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
						Build and share forms with your community. Zero backend, zero
						cost. All data stored in the browser.
					</p>
					<p className="text-base text-gray-500 max-w-2xl mx-auto mb-2">
						Create forms with 9 field types: text, email, number, dropdown,
						radio, checkbox, date, rating, and long text. Drag and drop to
						reorder. View responses and export to CSV.
					</p>
					<p className="text-sm text-gray-400 max-w-2xl mx-auto">
						💡 <strong>Tip:</strong> Use the dashboard to build forms, then
						share the experience link with your community to collect
						responses.
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-6 mb-10">
					<div className="bg-white rounded-xl p-6 shadow-md">
						<h3 className="font-semibold text-gray-900 mb-2">
							9 Field Types
						</h3>
						<p className="text-sm text-gray-600">
							Text, email, number, dropdown, radio, checkbox, date, rating,
							and long text fields.
						</p>
					</div>
					<div className="bg-white rounded-xl p-6 shadow-md">
						<h3 className="font-semibold text-gray-900 mb-2">
							Drag & Drop
						</h3>
						<p className="text-sm text-gray-600">
							Reorder fields with intuitive drag-and-drop. Edit labels,
							options, and required status.
						</p>
					</div>
					<div className="bg-white rounded-xl p-6 shadow-md">
						<h3 className="font-semibold text-gray-900 mb-2">
							Export CSV
						</h3>
						<p className="text-sm text-gray-600">
							View all responses in a table with basic analytics. Export to
							CSV with one click.
						</p>
					</div>
				</div>

				<div className="grid md:grid-cols-2 gap-6">
					<div className="bg-white rounded-xl p-6 shadow-md">
						<h3 className="text-lg font-bold text-gray-900 mb-1">
							Zero Backend
						</h3>
						<p className="text-xs text-gray-500 mb-2">
							No servers, no databases
						</p>
						<p className="text-gray-700 text-sm">
							All form data is stored in the browser&apos;s localStorage.
							No API calls, no database, no server costs.
						</p>
					</div>
					<div className="bg-white rounded-xl p-6 shadow-md">
						<h3 className="text-lg font-bold text-gray-900 mb-1">
							Free Forever
						</h3>
						<p className="text-xs text-gray-500 mb-2">
							$0 operation cost
						</p>
						<p className="text-gray-700 text-sm">
							Deploy on Vercel&apos;s free tier. No paid services
							required. Build unlimited forms with unlimited fields.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
