// src/App.jsx
import React, { useState } from "react";
import PostList from "./components/PostList";
import CreatePostForm from "./components/CreatePostForm";
import PostDetail from "./components/PostDetail";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handlePostCreated = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  const handleViewPost = (id) => {
    setSelectedPostId(id);
  };

  const handleBackToList = () => {
    setSelectedPostId(null);
  };

  return (
    // We keep the bg-gray-100 on the root div
    <div className="min-h-screen bg-gray-100">
      {/* --- STYLED HEADER --- */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-lg">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          <h1 className="text-4xl font-bold tracking-tight">
            Learnato Discussion Forum
          </h1>
          <p className="mt-1 text-indigo-100">
            "Empower learning through conversation."
          </p>
        </div>
      </header>

      {/* --- STYLED MAIN CONTENT --- */}
      <main className="container mx-auto max-w-4xl px-4 py-8">
        {selectedPostId ? (
          <div>
            <button
              onClick={handleBackToList}
              className="mb-4 text-blue-600 font-semibold hover:underline flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Back to all posts
            </button>
            <PostDetail postId={selectedPostId} />
          </div>
        ) : (
          <div className="space-y-8">
            <CreatePostForm onPostCreated={handlePostCreated} />
            <PostList key={refreshKey} onViewPost={handleViewPost} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
