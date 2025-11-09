// index.js
import express from "express";
import cors from "cors";

// Import routes
import postRoutes from "./routes/postRoutes.js"; // Note the .js extension

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Test Route ---
app.get("/", (req, res) => {
  res.send("Learnato Discussion Forum API is running!");
});

// --- API Routes ---
// Tell Express to use the postRoutes for any URL starting with /
app.use("/", postRoutes);

// --- Start the Server ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
