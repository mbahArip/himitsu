"use client";

import { Checkbox } from "~/components/ui/checkbox";

export default function DashboardPage() {
	return (
		<div data-container>
			<h1 className="text-2xl">Dashboard</h1>
			<ul>
				<li className="flex items-center gap-2">
					<Checkbox />
					How many environments do you have?
				</li>
				<li className="flex items-center gap-2">
					<Checkbox />
					Usage this month
				</li>
				<li className="flex items-center gap-2">
					<Checkbox />
					Key usage
				</li>

				<li className="flex items-center gap-2">
					<Checkbox />
					Area graph of usage
				</li>
				<li className="flex items-center gap-2">
					<Checkbox />
					Near expiry keys
				</li>
			</ul>
		</div>
	);
}
