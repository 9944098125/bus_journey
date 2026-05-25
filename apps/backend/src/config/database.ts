import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
	try {
		const connection = await mongoose.connect(process.env.MONGO_URI as string);

		console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
	} catch (error) {
		console.error("❌ MongoDB Connection Failed", error);

		process.exit(1);
	}
};
