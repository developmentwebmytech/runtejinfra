const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/runtej-infra";
if (!MONGODB_URI) throw new Error("MONGODB_URI not found");

// Connect to DB
async function connectToDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI, { dbName: "runtej-infra" });
}

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// Create or Update Admin
async function createAdmin() {
  await connectToDB();

  // 👉 Get from command line: node create-admin.js email password
  const email = process.argv[2] || "admin@runtejinfra.com";
  const password = process.argv[3] || "admin123";

  const hashedPassword = await bcrypt.hash(password, 12);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    existingUser.password = hashedPassword;
    existingUser.role = "admin";
    await existingUser.save();
    console.log("✅ Admin user updated.");
  } else {
    await User.create({
      name: "Admin User",
      email,
      password: hashedPassword,
      role: "admin",
    });
    console.log("✅ Admin user created.");
  }

  mongoose.connection.close();
  process.exit();
}

createAdmin().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
