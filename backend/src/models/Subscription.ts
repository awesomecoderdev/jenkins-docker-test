import { InferSchemaType, Schema, model } from "mongoose";

const SubscriptionSchema = new Schema({
	priceId: { type: Schema.Types.ObjectId, ref: "Pricing", required: true },
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	experiedAt: { type: Date },
	price: { type: Schema.Types.ObjectId, ref: "Pricing" },
});

export type Subscription = Model & InferSchemaType<typeof SubscriptionSchema>;
export const Subscription = model("Subscription", SubscriptionSchema);
