import { z } from "zod";

const UpdateMediaValidator = z.object({
	title: z.string().min(2, "Title must be at least 2 characters").optional(),
	archive: z.boolean().optional(),
});

type UpdateMediaValidator = typeof UpdateMediaValidator;

export { UpdateMediaValidator };
