require("dotenv").config(); // Load .env

exports.adminData = {
  name: process.env.ADMIN_NAME || "Admin",
  email: process.env.ADMIN_EMAIL || "",
  password: process.env.ADMIN_PASSWORD || "",
  role: process.env.ADMIN_ROLE || "admin",
};
