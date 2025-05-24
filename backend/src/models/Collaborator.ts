import { InferSchemaType, Schema, model } from "mongoose";

const CollaboratorSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	permission: [{ type: String }],
	status: { type: String },
});

export type Collaborator = Model & InferSchemaType<typeof CollaboratorSchema>;
export const Collaborator = model("Collaborator", CollaboratorSchema);
