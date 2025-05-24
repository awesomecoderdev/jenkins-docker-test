import app, { MethodNotAllowed, v1 } from "@/app";
import { auth, users, roles, medias, matters } from "@/routes";

// constants
const PORT = process.env.APP_PORT || 3000;

// routes
v1.route("/auth", auth);
v1.route("/users", users);
v1.route("/matters", matters);
v1.route("/roles", roles);
v1.route("/medias", medias);

export default {
	port: PORT,
	fetch: (req: Request) => app.fetch(req, process.env),
};
