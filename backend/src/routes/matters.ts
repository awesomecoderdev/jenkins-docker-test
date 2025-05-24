import { AppContext, MethodNotAllowed, v1 } from "@/app";
import { AuthMiddleware, RequiredMiddleware } from "@/middleware";
import { Role, Matter } from "@/models";
import { cache } from "@/utils/cache";
import Status from "@/utils/status";
import { zValidator } from "@hono/zod-validator";

import { UpdateMatterValidator, RegisterMatterValidator } from "@/validator";
import { Hono } from "hono";
import { ZodError } from "zod";
import { detailedZodMessages, ZodTransformer } from "@/validator";
import { wait } from "@/utils";

const matters = new Hono<AppContext>();

matters
	.get("/", async (c) => {
		const matters = await cache.remember("matters", 10, async () => {
			return await Matter.find().populate("documents").populate("collaborators");
		});
		// const matters = await Role.find();
		return c.json({ success: true, message: Status.OK_MESSAGE, data: { matters } }, Status.OK);
	})
	.post("/create", zValidator("json", RegisterMatterValidator, ZodTransformer), async (c) => {
		const payload = await c.req.valid("json");
		const { collaborators } = payload;

		if (collaborators) {
			for (const collaborator of collaborators) {
				const collaboratorDoc = await Matter.findById(collaborator);
				if (!collaboratorDoc) {
					return c.json(
						{
							success: false,
							message: `Collaborator with ID ${collaborator} does not exist`,
						},
						Status.BAD_REQUEST
					);
				}
			}
		}

		// Create the matter
		const matter = await Matter.create(payload);
		if (!matter) {
			return c.json(
				{
					success: false,
					message: "Failed to create matter",
				},
				Status.INTERNAL_SERVER_ERROR
			);
		}

		// update the cache
		await cache.set(`matter:${matter._id}`, matter, 10);

		// clear cache
		await cache.delete("matters");

		return c.json({
			success: true,
			message: Status.CREATED_MESSAGE,
			data: {
				matter,
			},
		});
	})
	.all(MethodNotAllowed);

// Single Matters Route
matters
	.get("/:id", async (c) => {
		const { id } = await c.req.param();
		const matter = await cache.remember(`matter:${id}`, 10, async () => {
			return await Matter.findById(id).populate("documents").populate("collaborators");
		});
		if (!matter) return c.json({ success: false, message: "Not Found" }, Status.NOT_FOUND);
		return c.json({
			success: true,
			message: Status.OK_MESSAGE,
			data: {
				matter,
			},
		});
	})
	.post(RequiredMiddleware, zValidator("json", UpdateMatterValidator, ZodTransformer), async (c) => {
		const { id } = await c.req.param();
		const payload = await c.req.valid("json");

		// Update and return the updated document
		const matter = await Matter.findByIdAndUpdate(
			id,
			{ $set: payload },
			{
				new: true,
				runValidators: true,
			}
		).populate("role");

		if (!matter) return c.json({ success: false, message: "Not Found" }, Status.NOT_FOUND);

		// Optional: update the cache
		await cache.set(`matter:${id}`, matter, 10);
		// clear cache
		await cache.delete("matters");

		return c.json({
			success: true,
			message: Status.OK_MESSAGE,
			data: {
				matter,
			},
		});
	})
	.all(MethodNotAllowed);

export { matters };
