// seed.ts
import mongoose from "mongoose";
import { Role, User } from "@/models";

// Use your .env value or hardcode it here
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://root:password@localhost:27017/convey?authSource=admin";

const roles = [
	{
		name: "vendor",
		icon: "📦",
		permissions: ["create", "update", "delete"],
	},
	{
		name: "buyer",
		icon: "🛒",
		permissions: ["view", "purchase"],
	},
];

const users = [
	{
		firstName: "Alice",
		lastName: "Smith",
		companyName: "Alice Co.",
		email: "alice@example.com",
		password: "hashedPassword123", // You should hash the password before saving in production
		stripeCustomerId: "cus_12345",
	},
	{
		firstName: "Bob",
		lastName: "Jones",
		companyName: "Bob Ltd.",
		email: "bob@example.com",
		password: "hashedPassword456", // Same as above
		stripeCustomerId: "cus_67890",
	},
];

async function seed() {
	try {
		await mongoose.connect(DATABASE_URL);
		console.log("✅ Connected to MongoDB");

		// Find roles by name
		let vendor = await Role.findOne({ name: "vendor" });
		let buyer = await Role.findOne({ name: "buyer" });

		if (!vendor || !buyer) {
			(await Role.deleteMany({})) && console.log("🧹 Cleared existing Role");
			(await Role.insertMany(roles)) && console.log("🌱 Seeded Role successfully");
			vendor = await Role.findOne({ name: "vendor" });
			buyer = await Role.findOne({ name: "buyer" });
		}

		(await User.deleteMany({})) && console.log("🧹 Cleared existing User");
		(await User.insertMany(
			users.map((user) => ({
				...user,
				role: buyer || vendor,
			}))
		)) && console.log("🌱 Seeded User successfully");

		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding data:", error);
		process.exit(1);
	}
}

seed();
