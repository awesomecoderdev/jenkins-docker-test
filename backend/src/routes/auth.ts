import { AppContext, MethodNotAllowed, v1 } from "@/app";
import { Role, User } from "@/models";
import { RegisterUserValidator, UpdateUserValidator } from "@/validator/user";
import { detailedZodMessages, ZodTransformer } from "@/validator";
import { cache } from "@/utils/cache";
import { comparePassword, hashPassword } from "@/utils/password";
import { domain, wait } from "@/utils";
import Status from "@/utils/status";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { jwt, sign, verify } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ZodError } from "zod";
import { WithoutAuthMiddleware, AuthMiddleware, RequiredMiddleware } from "@/middleware";

const auth = new Hono<AppContext>();

auth.get("/", AuthMiddleware, async (c) => {
	const email = c.get("user")!.email;
	const user = await cache.remember(`user:${email}`, 10, async () => {
		return await User.findOne({ email }).populate("role");
	});
	return c.json({ success: true, message: Status.OK_MESSAGE, data: { user } }, Status.OK);
}).all(MethodNotAllowed);

auth.post("/login", RequiredMiddleware, WithoutAuthMiddleware, async (c) => {
	const host = domain(String(c.req.header("host") || "localhost"));
	const { email, password } = await c.req.json();

	if (!email || !password) {
		return c.json(
			{
				success: false,
				message: "Validation Errors",
				errors: {
					...(!email && { email: "Email is required" }),
					...(!password && { password: "Password is required" }),
				},
			},
			Status.BAD_REQUEST
		);
	}

	const user = await cache.remember<User | null>(`user:${email}`, 10, async () => {
		return await User.findOne({ email });
	});

	if (!user) {
		return c.json(
			{
				success: false,
				message: "Invalid Credentials",
			},
			Status.UNAUTHORIZED
		);
	}

	const isPasswordValid = await comparePassword(password, user.password!);
	if (!isPasswordValid) {
		return c.json(
			{
				success: false,
				message: "Invalid Credentials",
			},
			Status.BAD_REQUEST
		);
	}

	const payload = {
		user,
		exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
	};
	const token = await sign(payload, c.env.JWT_SECRET);

	setCookie(c, "session", token, {
		path: "/",
		secure: true,
		domain: `*.${host}`,
		httpOnly: true,
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		sameSite: "Strict",
	});

	return c.json({
		success: true,
		message: Status.OK_MESSAGE,
		data: {
			user,
			token,
		},
	});
}).all(MethodNotAllowed);

auth.post("/register", RequiredMiddleware, WithoutAuthMiddleware, zValidator("json", RegisterUserValidator, ZodTransformer), async (c) => {
	const { email, password, firstName, lastName, role, companyName } = await c.req.valid("json");

	const exist = await cache.remember<User | null>(`user:${email}`, 10, async () => {
		return await User.findOne({ email });
	});

	if (exist) {
		return c.json(
			{
				success: false,
				message: "User already exists",
			},
			Status.CONFLICT
		);
	}

	const hashedPassword = await hashPassword(password);
	const userRole = await cache.remember(`role:${role.toLowerCase()}`, 10, async () => {
		return await Role.findOne({ name: role.toLowerCase() });
	});

	if (!userRole) {
		return c.json(
			{
				success: false,
				message: "Role not found",
			},
			Status.NOT_FOUND
		);
	}

	const newUser = await User.create({
		email,
		password: hashedPassword,
		firstName,
		lastName,
		role: userRole,
		companyName,
	});

	if (!newUser) {
		return c.json(
			{
				success: false,
				message: "User creation failed",
			},
			Status.INTERNAL_SERVER_ERROR
		);
	}

	const { role: _, ...user } = newUser.toObject();

	const payload = {
		user,
		exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
	};
	const token = await sign(payload, c.env.JWT_SECRET);

	return c.json(
		{
			success: true,
			message: Status.CREATED_MESSAGE,
			data: {
				user: newUser,
				token,
			},
		},
		Status.CREATED
	);
}).all(MethodNotAllowed);

export { auth };
