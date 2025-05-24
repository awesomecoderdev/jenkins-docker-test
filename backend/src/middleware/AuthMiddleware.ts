import { domain } from "@/utils";
import { auth } from "@/utils/auth";
import Status from "@/utils/status";
import { Context } from "hono";
import { getSignedCookie, setCookie, setSignedCookie } from "hono/cookie";

export async function AuthMiddleware(c: Context, next: () => Promise<void>) {
	const host = String(c.req.header("host") || "localhost");

	const authorization = String(c.req.header("Authorization") ?? "");
	const token = authorization.replace(/^Bearer\s+/i, "");
	const user = await auth(token, c.env.JWT_SECRET);
	if (!user) return c.json({ success: false, message: Status.UNAUTHORIZED_MESSAGE }, Status.UNAUTHORIZED);
	c.set("user", user);

	// Regular cookies
	setCookie(c, "session", token, {
		path: "/",
		secure: true,
		domain: domain(host),
		httpOnly: true,
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		sameSite: "Strict",
	});

	return next();
}
