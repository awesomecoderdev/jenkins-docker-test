import "dotenv/config";
import { Hono, Context } from "hono";
import { logger } from "hono/logger";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import Status from "@/utils/status";

import { trimTrailingSlash } from "hono/trailing-slash";
import { prettyJSON } from "hono/pretty-json";
import mongoose from "mongoose";
import { User } from "@/models";
import { ZodError } from "zod";
import { detailedZodMessages } from "./validator";

type Bindings = {
	JWT_SECRET: string;
	DATABASE_URL: string;
};

type Variables = {
	user: User | null;
};

export interface AppContext {
	Bindings: Bindings;
	Variables: Variables;
}

const app = new Hono<AppContext>();

// logger
app.use(logger());
// With options: prettyJSON({ space: 4 })
app.use(prettyJSON());
// trim slash
app.use(trimTrailingSlash());

// CORS should be called before the route
app.use("*", cors());

// method not allowed route
export const MethodNotAllowed = (c: Context) => c.json({ success: false, message: `${c.req.method} Method Not Allowed` }, Status.METHOD_NOT_ALLOWED);

// Load env variables
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://root:password@localhost:27017/convey?authSource=admin";

// Connect to MongoDB via Mongoose
mongoose
	.connect(DATABASE_URL)
	.then(() => console.log("✅ Connected to MongoDB"))
	.catch((err) => console.error("❌ MongoDB connection error:", err));

// base router
export const v1 = app.basePath("/v1");
export const users = v1.basePath("/users");

// Error Handler
// Not Found
app.notFound(async (c) => c.json({ success: false, message: Status.NOT_FOUND_MESSAGE }, Status.NOT_FOUND));

// On Error
app.onError((error, c) => {
	console.error(`On Error :${error}`);
	return c.json(
		{
			success: false,
			message: Status.INTERNAL_SERVER_ERROR_MESSAGE,
			...(process.env.NODE_ENV !== "production" && {
				message: error.message,
			}),
			...(error instanceof ZodError && {
				error: detailedZodMessages(error),
			}),
		},
		Status.INTERNAL_SERVER_ERROR
	);
});

// base routes
app.get("/", (c) => c.json({ success: true, message: "BASE", headers: c.req.header() })).all(MethodNotAllowed);
v1.get("/", (c) => c.json({ success: true, message: "V1" })).all(MethodNotAllowed);

export default app;
