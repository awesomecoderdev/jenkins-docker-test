import { InferSchemaType, Schema, model } from "mongoose";

const MediaSchema = new Schema({
	title: { type: String, required: true },
	fileurl: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	archive: { type: Boolean, default: false },
});

export type Media = Model & InferSchemaType<typeof MediaSchema>;
export const Media = model("Media", MediaSchema);
