import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
	console.log("========== DB START ==========");
	console.log("MONGO_URI EXISTS:", !!process.env.MONGO_URI);

	try {
		const connection = await mongoose.connect(process.env.MONGO_URI as string);

		console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
	} catch (error) {
		console.error("❌ MongoDB Connection Failed");
		console.error(error);

		throw error;
	}
};
