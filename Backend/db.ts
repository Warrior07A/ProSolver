import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
})

const ProbSchema = new mongoose.Schema({
    user_id: mongoose.Types.ObjectId,
    title: String,
    description: String,
    polygon_link: String,
    tags: [String]
})


const User = mongoose.model("User", userSchema);
const Problems = mongoose.model("Problems", ProbSchema);

export { User, Problems };