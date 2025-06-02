"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import axios from "axios";

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { data: session } = authClient.useSession();

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blog");
      setBlogs(data.blogs);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to fetch blogs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);

    try {
      await axios.post("/api/blog", {
        title,
        content,
      });

      // Reset form and refresh blogs
      setTitle("");
      setContent("");
      fetchBlogs();
    } catch (err) {
      console.error("Error creating blog:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to create blog");
      } else {
        setError("Failed to create blog");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Loading blogs...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Blogs</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            Back to Home
          </Link>
        </div>

        {session?.user && (
          <div className="mb-8 p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Create New Blog</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded border-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border rounded h-32 border-white"
                  required
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-500 text-white px-4 py-2 rounded ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Blog'}
              </button>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {blogs.length === 0 ? (
            <p>No blogs found.</p>
          ) : (
            blogs.map((blog) => (
              <article
                key={blog._id}
                className="p-6 border rounded-lg space-y-4"
              >
                <h2 className="text-2xl font-bold">{blog.title}</h2>
                <p className="whitespace-pre-wrap">{blog.content}</p>
                <div className="text-sm text-gray-500">
                  <p>
                    Written by {blog.author.name}
                  </p>
                  <p>
                    Posted on{" "}
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
