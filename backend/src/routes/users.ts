import { AppContext, MethodNotAllowed, v1 } from "@/app";
import { Role, User } from "@/models";
import { cache } from "@/utils/cache";
import Status from "@/utils/status";
import { zValidator } from "@hono/zod-validator";

import { UpdateUserValidator } from "@/validator";
import { Hono } from "hono";
import { ZodError } from "zod";
import { detailedZodMessages, ZodTransformer } from "@/validator";
import { wait } from "@/utils";
import { RequiredMiddleware, AuthMiddleware } from "@/middleware";

const users = new Hono<AppContext>();

users
	.get("/", async (c) => {
		const users = await cache.remember("users", 10, async () => {
			return await User.find().populate("role");
		});
		// const users = await Role.find();
		return c.json({ success: true, message: Status.OK_MESSAGE, data: { users } }, Status.OK);
	})
	.all(MethodNotAllowed);

// Single Users Route
users
	.get("/:id", async (c) => {
		const { id } = await c.req.param();
		const user = await cache.remember(`user:${id}`, 10, async () => {
			return await User.findById(id).populate("role");
		});
		if (!user) return c.json({ success: false, message: "Not Found" }, Status.NOT_FOUND);
		return c.json({
			success: true,
			message: Status.OK_MESSAGE,
			data: {
				user,
			},
		});
	})
	.post(RequiredMiddleware, zValidator("json", UpdateUserValidator, ZodTransformer), async (c) => {
		const { id } = await c.req.param();
		const payload = await c.req.valid("json");

		// Update and return the updated document
		const user = await User.findByIdAndUpdate(
			id,
			{ $set: payload },
			{
				new: true,
				runValidators: true,
			}
		).populate("role");

		if (!user) return c.json({ success: false, message: "Not Found" }, Status.NOT_FOUND);

		// Optional: update the cache
		await cache.set(`user:${id}`, user, 10);
		// clear cache
		await cache.delete("users");

		return c.json({
			success: true,
			message: Status.OK_MESSAGE,
			data: {
				user,
			},
		});
	})
	.all(MethodNotAllowed);

export { users };
