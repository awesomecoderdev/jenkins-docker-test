import { User } from "@/models";
import { verify } from "hono/jwt";

export async function auth(header: string, secret: string): Promise<User | null> {
	try {
		const token = header.replace(/^Bearer\s+/i, "");
		const request = await verify(token, secret);
		return (request.user as User) || null;
	} catch (error) {
		return null;
	}
}
