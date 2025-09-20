import { SlugPage as ClientSlugPage } from "@/app/(pages)/slug/[...id]/SlugPage/SlugPage";
import CustomInput from "@/shared/components/Input";

export default function Home() {
	return (
		<div className={"flex flex-col gap-4"}>
			<ClientSlugPage id={"666"} />
			<div className="flex flex-col gap-y-2 m-auto">
				<CustomInput
					label="Email"
					name="email"
					type="email"
					title="Enter a valid email address."
					autoComplete="email"
					required
					data-testid="email-input"
				/>
				<CustomInput
					label="Password"
					name="password"
					type="password"
					autoComplete="current-password"
					required
					data-testid="password-input"
				/>
			</div>
		</div>
	);
}
