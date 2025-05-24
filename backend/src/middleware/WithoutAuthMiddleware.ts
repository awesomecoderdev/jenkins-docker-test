import { domain } from "@/utils";
import { auth } from "@/utils/auth";
import Status from "@/utils/status";
import { Context } from "hono";
import { getSignedCookie, setCookie, setSignedCookie } from "hono/cookie";

export async function WithoutAuthMiddleware(c: Context, next: () => Promise<void>) {
	const host = String(c.req.header("host") || "localhost");
	const authorization = String(c.req.header("Authorization") ?? "");
	const token = authorization.replace(/^Bearer\s+/i, "");

	if (token) return c.json({ success: false, message: "User is already authenticated. Access denied." }, Status.BAD_REQUEST);

	// const user = await auth(token, c.env.JWT_SECRET);
	// if (user) {
	// 	return c.json({ success: false, message: "User is already authenticated. Access denied." }, Status.BAD_REQUEST);
	// }

	return next();
}
