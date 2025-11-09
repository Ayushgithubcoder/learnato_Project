// controllers/postController.js

// --- In-Memory Database ---
let posts = [
  {
    id: 1,
    title: "How do I deploy Node.js on Cloud Run?",
    content: "I'm new to Google Cloud and need help deploying.",
    votes: 5,
    author: "Rohan",
    replies: [
      { id: 1, text: "Use gcloud CLI with region flag" },
      { id: 2, text: "Enable Cloud Build first!" },
    ],
  },
  {
    id: 2,
    title: "What is the difference between React and Node.js?",
    content: "Aren't they both JavaScript?",
    votes: 10,
    author: "Jane",
    replies: [],
  },
];

// --- Helper function to get next ID ---
function getNextId() {
  return posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1;
}

function getNextReplyId(post) {
  return post.replies.length > 0
    ? Math.max(...post.replies.map((r) => r.id)) + 1
    : 1;
}

// --- Controller Functions ---

// GET /posts - Get all posts
export function getAllPosts(req, res) {
  // Sort by votes (descending)
  const sortedPosts = [...posts].sort((a, b) => b.votes - a.votes);
  res.json(sortedPosts);
}

// POST /posts - Create a new post
export function createPost(req, res) {
  const { title, content, author } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const newPost = {
    id: getNextId(),
    title,
    content,
    votes: 0,
    author: author || "Anonymous",
    replies: [],
  };

  posts.push(newPost);
  res.status(201).json(newPost);
}

// GET /posts/:id - Get a single post by ID
export function getPostById(req, res) {
  const id = parseInt(req.params.id);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.json(post);
}

// POST /posts/:id/reply - Add a reply to a post
export function addReply(req, res) {
  const id = parseInt(req.params.id);
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Reply text is required" });
  }

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const newReply = {
    id: getNextReplyId(post),
    text,
  };

  post.replies.push(newReply);
  res.status(201).json(post);
}

// POST /posts/:id/upvote - Upvote a post
export function upvotePost(req, res) {
  const id = parseInt(req.params.id);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  post.votes += 1;
  res.json(post);
}
