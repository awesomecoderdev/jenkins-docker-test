import { InferSchemaType, Schema, model } from "mongoose";

const RoleSchema = new Schema({
	name: { type: String, enum: ["vendor", "buyer"], required: true },
	icon: { type: String, required: true },
	permissions: { type: [String], default: [] },
});

export type Role = Model & InferSchemaType<typeof RoleSchema>;
export const Role = model("Role", RoleSchema);
