import mongoose from"mongoose";

const connectDB = (URI: string) => mongoose.connect(URI);

export default connectDB