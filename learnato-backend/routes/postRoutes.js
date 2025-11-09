// routes/postRoutes.js
import express from "express";
import {
  getAllPosts,
  createPost,
  getPostById,
  addReply,
  upvotePost,
} from "../controllers/postController.js"; // Note the .js extension, it's often required in modules

const router = express.Router();

// Define the API routes
router.get("/posts", getAllPosts);
router.post("/posts", createPost);
router.get("/posts/:id", getPostById);
router.post("/posts/:id/reply", addReply);
router.post("/posts/:id/upvote", upvotePost);

export default router;
