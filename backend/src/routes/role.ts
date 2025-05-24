import { AppContext, MethodNotAllowed, v1 } from "@/app";
import AuthMiddleware from "@/middleware/AuthMiddleware";
import { Role } from "@/models";
import { cache } from "@/utils/cache";
import Status from "@/utils/status";
import { Hono } from "hono";

const roles = new Hono<AppContext>();

roles
	.get("/", async (c) => {
		const roles = await cache.remember("roles", 5, async () => {
			return await Role.find();
		});
		// const roles = await Role.find();
		return c.json({ success: true, message: Status.OK_MESSAGE, data: { roles } }, Status.OK);
	})
	.all(MethodNotAllowed);

export { roles };
