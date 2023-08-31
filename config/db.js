const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const connection = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("MongoDB Connected successfully");
	} catch (error) {
		console.log(`Logged DB Error: ${error}`);
		process.exit(1);
	}
};

module.exports = connectDB;
