import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { Blog } from "@/lib/models/Blog";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/config/db";

// GET all blogs
export async function GET() {
  try {
    // Ensure database connection
    await connectDB();

    const blogs = await Blog.find({}).exec();

    // Get user details from the native MongoDB collection
    const userCollection = db.collection("user");

    const blogsWithAuthor = await Promise.all(
      blogs.map(async (blog) => {
        const author = await userCollection.findOne({ _id: blog.author });
        return {
          ...blog.toObject(),
          author: {
            id: author?._id,
            name: author?.name || "Unknown",
            email: author?.email || "No email",
          },
        };
      })
    );

    return NextResponse.json({ blogs: blogsWithAuthor }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);

    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST new blog
export async function POST(request: NextRequest) {
  try {
    // Ensure database connection
    await connectDB();

    // Get blog data from request body
    const { title, content } = await request.json();

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Get the current user from the session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create new blog
    const blog = await Blog.create({
      title,
      content,
      author: session.user.id,
    });

    // Get author details from the native MongoDB collection
    const userCollection = db.collection("user");
    const author = await userCollection.findOne({ id: session.user.id });

    const blogWithAuthor = {
      ...blog.toObject(),
      author: {
        id: author?.id,
        name: author?.name,
        email: author?.email,
      },
    };

    return NextResponse.json({ blog: blogWithAuthor }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
