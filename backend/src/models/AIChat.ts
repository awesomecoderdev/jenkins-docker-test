import { InferSchemaType, Schema, model } from "mongoose";

const AIChatSchema = new Schema({
	aiResponse: { type: String },
	userMessage: { type: String },
	createdAt: { type: String },
	queryResult: { type: Schema.Types.Mixed },
});

export type AIChat = Model & InferSchemaType<typeof AIChatSchema>;
export const AIChat = model("AIChat", AIChatSchema);
