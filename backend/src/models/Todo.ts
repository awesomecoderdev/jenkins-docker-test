import { InferSchemaType, Schema, model } from "mongoose";

const TodoSchema = new Schema({
	mattersId: { type: Schema.Types.ObjectId, ref: "Matter" },
	userId: { type: Schema.Types.ObjectId, ref: "User" },
	index: { type: Number },
	title: { type: String },
	description: { type: String },
	status: { type: String },
});

export type Todo = Model & InferSchemaType<typeof TodoSchema>;
export const Todo = model("Todo", TodoSchema);
