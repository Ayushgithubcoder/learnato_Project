// src/components/PostList.jsx
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../App";

function PostList({ onViewPost }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/posts`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleUpvote = async (postId) => {
    // Prevent double-click
    const button = document.getElementById(`upvote-btn-${postId}`);
    if (button) button.disabled = true;

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/upvote`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to upvote post");

      const updatedPost = await response.json();

      setPosts((currentPosts) =>
        currentPosts
          .map((post) => (post.id === postId ? updatedPost : post))
          .sort((a, b) => b.votes - a.votes)
      );
    } catch (error) {
      console.error("Failed to upvote post:", error);
    } finally {
      if (button) button.disabled = false;
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading posts...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-3 rounded-md">
        Error loading posts: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-3">
        Discussions
      </h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">
          No posts yet. Be the first to create one!
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  {/* Post Title & Author */}
                  <div>
                    <h3 className="text-2xl font-bold text-indigo-700 hover:text-indigo-800">
                      Q: {post.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      Posted by:{" "}
                      <span className="font-medium text-gray-700">
                        {post.author}
                      </span>
                    </span>
                  </div>

                  {/* Upvote Button */}
                  <button
                    id={`upvote-btn-${post.id}`}
                    onClick={() => handleUpvote(post.id)}
                    title="Upvote post"
                    className="flex flex-col items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors disabled:opacity-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                        transform="rotate(45 10 10) scale(0.8) translate(-2.5 -2.5)"
                      />
                    </svg>
                    <span className="font-bold text-lg">{post.votes}</span>
                    <span className="text-xs">Votes</span>
                  </button>
                </div>

                {/* Post Content Snippet (optional) */}
                <p className="text-gray-700 mt-4 truncate">{post.content}</p>

                <div className="flex justify-between items-center mt-6">
                  {/* Meta Info */}
                  <span className="text-sm font-medium text-indigo-500">
                    {post.replies.length} Replies
                  </span>

                  {/* View Replies Button */}
                  <button
                    onClick={() => onViewPost(post.id)}
                    className="bg-indigo-500 text-white font-semibold px-5 py-2 rounded-md hover:bg-indigo-600 transition-colors"
                  >
                    View Replies
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostList;
