import { InferSchemaType, Schema, model } from "mongoose";

const UserSchema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	companyName: { type: String },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
	stripeCustomerId: { type: String },
});

export type User = Model & InferSchemaType<typeof UserSchema>;
export const User = model("User", UserSchema);
