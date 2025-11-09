// src/components/PostDetail.jsx
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../App";

// --- Styled, internal component for the reply form ---
function AddReplyForm({ postId, onReplyAdded }) {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error("Failed to add reply");
      setText("");
      onReplyAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner"
    >
      <h4 className="text-xl font-semibold mb-3 text-gray-800">
        Add Your Reply
      </h4>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <textarea
        rows="4"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Share your knowledge or follow-up question..."
      ></textarea>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Reply"}
      </button>
    </form>
  );
}

// --- The Main PostDetail Component ---
function PostDetail({ postId }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setPost(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const handleReplyAdded = () => {
    fetchPost();
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center text-gray-500">
        Loading post details...
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        Error loading post: {error}
      </div>
    );
  }
  if (!post) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        Post not found.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
      {/* Post Header */}
      <div className="p-8 border-b">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          Q: {post.title}
        </h2>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <span>
            Posted by{" "}
            <span className="font-semibold text-gray-700">{post.author}</span>
          </span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span className="font-semibold text-indigo-600">
            {post.votes} Votes
          </span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span className="font-semibold text-indigo-600">
            {post.replies.length} Replies
          </span>
        </div>
      </div>

      {/* Post Body */}
      <div className="p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Details:</h3>
        <div className="prose prose-lg max-w-none text-gray-800">
          {/* Use whitespace-pre-wrap to respect newlines in the content */}
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>

      {/* Replies Section */}
      <div className="bg-gray-50 p-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Replies</h3>
        <div className="space-y-5">
          {post.replies.length > 0 ? (
            post.replies.map((reply) => (
              <div
                key={reply.id}
                className="bg-white border-l-4 border-indigo-500 p-5 rounded-lg shadow-md"
              >
                <p className="text-gray-700 text-lg">{reply.text}</p>
                {/* You could add reply author/date here if you had it */}
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">
              No replies yet. Be the first to add one!
            </p>
          )}
        </div>

        {/* Add Reply Form */}
        <AddReplyForm postId={post.id} onReplyAdded={handleReplyAdded} />
      </div>
    </div>
  );
}

export default PostDetail;
