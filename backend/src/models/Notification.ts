import { InferSchemaType, Schema, model } from "mongoose";

const NotificationSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User" },
	title: { type: String },
	content: { type: String },
	seenAt: { type: Date },
});

export type Notification = Model & InferSchemaType<typeof NotificationSchema>;
export const Notification = model("Notification", NotificationSchema);
