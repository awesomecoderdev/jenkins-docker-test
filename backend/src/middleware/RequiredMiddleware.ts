import Status from "@/utils/status";
import { Context } from "hono";

export async function RequiredMiddleware(c: Context, next: () => Promise<void>) {
	try {
		await c.req.json();
	} catch (error) {
		return c.json(
			{
				success: false,
				message: "Validation Errors",
				errors: ["Please fill all required fields."],
			},
			Status.BAD_REQUEST
		);
	}

	return next();
}
