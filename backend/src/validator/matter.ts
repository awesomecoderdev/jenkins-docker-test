import { z } from "zod";

const UpdateMatterValidator = z.object({
	title: z.string({ required_error: "Title is required" }).min(1, "Title is required").optional(),
	description: z.string().optional(),
	document: z.array(z.string()).optional(), // Array of ObjectId as string
	criticalNotes: z.string().optional(),
	salesPrice: z.number().optional(),
	deposit: z.number().optional(),
	coolingOffDay: z.number().optional(),
	commission: z.number().optional(),
	status: z.string().optional(),
	collaborators: z.union([z.string(), z.array(z.string())]).optional(), // ObjectId(s) as string(s)
});

type UpdateMatterValidator = typeof UpdateMatterValidator;
export { UpdateMatterValidator };

const RegisterMatterValidator = z.object({
	title: z.string({ required_error: "Title is required" }).min(1, "Title is required"),
	description: z.string().optional(),
	document: z.array(z.string()).optional(), // Array of ObjectId as string
	criticalNotes: z.string().optional(),
	salesPrice: z.number().optional(),
	deposit: z.number().optional(),
	coolingOffDay: z.number().optional(),
	commission: z.number().optional(),
	status: z.string().optional(),
	collaborators: z.union([z.string(), z.array(z.string())]).optional(), // ObjectId(s) as string(s)
});
type RegisterMatterValidator = typeof RegisterMatterValidator;
export { RegisterMatterValidator };
