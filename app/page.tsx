import { Button, Heading, Text, Card } from "@whop/react/components";
import Link from "next/link";

export default function Page() {
	return (
		<div className="py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-lg mx-auto">
				<Card className="p-8">
					<div className="text-center mb-8">
						<div className="w-16 h-16 rounded-2xl bg-blue-a3 flex items-center justify-center mx-auto mb-5 text-7">
							📝
						</div>
						<Heading size="7" weight="bold" className="mb-3">
							Form Builder
						</Heading>
						<Text size="3" color="gray" className="block mb-1">
							Build and share forms with your community.
						</Text>
						<Text size="2" color="gray">
							Zero backend. Zero cost.
						</Text>
					</div>

					<div className="flex flex-col gap-3">
						<Link href="https://docs.whop.com/apps" target="_blank">
							<Button variant="classic" className="w-full" size="3">
								Developer Docs
							</Button>
						</Link>
					</div>
				</Card>
			</div>
		</div>
	);
}
