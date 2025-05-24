import { capitalize } from "@/utils";
import Status from "@/utils/status";
import { Context } from "hono";
import { ZodError } from "zod";

export * from "@/validator/user";
export * from "@/validator/media";
export * from "@/validator/matter";

export function detailedZodMessages(error: ZodError) {
	const formatted: Record<string, string[]> = {};

	error.issues.forEach((issue) => {
		const field = issue.path.join(".");
		const message = `${capitalize(field)} field is ${issue.message.toLowerCase()}`;
		if (!formatted[field]) {
			formatted[field] = [];
		}
		formatted[field].push(message);
	});

	return formatted;
}

export function ZodTransformer({ success, error }: any, c: Context) {
	if (!success) {
		return c.json(
			{
				success: false,
				message: "Validation Error",
				errors: detailedZodMessages(error),
			},
			Status.UNPROCESSABLE_ENTITY
		);
	}
}
