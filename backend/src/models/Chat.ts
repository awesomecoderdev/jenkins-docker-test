import { InferSchemaType, Schema, model } from "mongoose";

const ChatSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	content: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	seenAt: { type: Date },
	parentId: { type: Schema.Types.ObjectId, ref: "Chat" },
	metadata: { type: Schema.Types.Mixed },
});

export type Chat = InferSchemaType<typeof ChatSchema>;
export const Chat = model("Chat", ChatSchema);
