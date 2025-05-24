import { AppContext, MethodNotAllowed, v1 } from "@/app";
import { Media, Role, User } from "@/models";
import { cache } from "@/utils/cache";
import Status from "@/utils/status";
import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";
import { ZodError } from "zod";
import { detailedZodMessages, ZodTransformer } from "@/validator";
import { UpdateMediaValidator } from "@/validator";

const medias = new Hono<AppContext>();

medias
	.get("/", async (c) => {
		const medias = await cache.remember("medias", 10, async () => {
			return await Media.find();
		});
		return c.json({ success: true, message: Status.OK_MESSAGE, data: { medias } }, Status.OK);
	})
	.all(MethodNotAllowed);

// Single media Route
medias
	.get("/:id", async (c) => {
		const { id } = await c.req.param();
		const media = await cache.remember(`media:${id}`, 10, async () => {
			return await Media.findById(id).populate("role");
		});
		if (!media) return c.json({ success: false, message: "Not Found" }, Status.NOT_FOUND);
		return c.json({
			success: true,
			message: Status.OK_MESSAGE,
			data: {
				media,
			},
		});
	})
	// .post(zValidator("json", UpdateMediaValidator, ZodTransformer), async (c) => {
	// 	const { id } = await c.req.param();
	// 	const payload = await c.req.valid("json");

	// 	// Update and return the updated document
	// 	const media = await Media.findByIdAndUpdate(
	// 		id,
	// 		{ $set: payload },
	// 		{
	// 			new: true,
	// 			runValidators: true,
	// 		}
	// 	);

	// 	if (!media) return c.json({ success: false, message: "Not Found" }, Status.NOT_FOUND);

	// 	// Optional: update the cache
	// 	await cache.set(`media:${id}`, media, 10);
	// 	// clear cache
	// 	await cache.delete("medias");

	// 	return c.json(
	// 		{
	// 			success: true,
	// 			message: Status.OK_MESSAGE,
	// 			data: {
	// 				media,
	// 			},
	// 		},
	// 		Status.OK
	// 	);
	// })
	.all(MethodNotAllowed);

export { medias };
