import { InferSchemaType, Schema, model } from "mongoose";

const DocumentSchema = new Schema({
	title: { type: String, required: true },
	content: { type: String },
	attachment: { type: Schema.Types.ObjectId, ref: "Media" },
	sentAt: { type: Date },
	singedAt: { type: Date },
});

export type Document = Model & InferSchemaType<typeof DocumentSchema>;
export const Document = model("Document", DocumentSchema);
