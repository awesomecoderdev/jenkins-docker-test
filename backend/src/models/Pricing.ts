import { InferSchemaType, Schema, model } from "mongoose";

const PricingSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	price: { type: Number },
	role: { type: String },
});

export type Pricing = Model & InferSchemaType<typeof PricingSchema>;
export const Pricing = model("Pricing", PricingSchema);
