import { z } from "zod";

const UpdateUserValidator = z.object({
	firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
	lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
	companyName: z.string().min(2, "Company name must be at least 2 characters").optional(),
	email: z.string().email("Invalid email format").optional(),
});
type UpdateUserValidator = typeof UpdateUserValidator;
export { UpdateUserValidator };

const RegisterUserValidator = z.object({
	firstName: z.string().min(2, "First name must be at least 2 characters"),
	lastName: z.string().min(2, "Last name must be at least 2 characters"),
	companyName: z.string().min(2, "Company name must be at least 2 characters").optional(),
	email: z.string().email("Invalid email format"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	role: z.string().nonempty("Role is required"),
	// stripeCustomerId: z.string().optional(),
});
type RegisterUserValidator = typeof RegisterUserValidator;
export { RegisterUserValidator };
