import { InferSchemaType, Schema, model } from "mongoose";

const MatterSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	document: [{ type: Schema.Types.ObjectId, ref: "Document" }],
	criticalNotes: { type: String },
	salesPrice: { type: Number },
	deposit: { type: Number },
	coolingOffDay: { type: Number },
	commission: { type: Number },
	status: { type: String },
	collaborators: { type: Schema.Types.ObjectId, ref: "Collaborator" },
});

export type Matter = Model & InferSchemaType<typeof MatterSchema>;
export const Matter = model("Matter", MatterSchema);
