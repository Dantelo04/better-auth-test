import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { Blog } from "@/lib/models/Blog";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getNativeUserById } from "@/lib/services/getNativeUser";

// GET all blogs
export async function GET() {
  try {
    // Ensure database connection
    await connectDB();

    const blogs = await Blog.find({}).exec();

    const blogsWithAuthor = await Promise.all(
      blogs.map(async (blog) => {
        const author = await getNativeUserById(blog.author);

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

    // Get author details from the native MongoDB collection
    const author = await getNativeUserById(session.user.id);

    //find blogs with the same author
    const blogs = await Blog.find({ author: session.user.id });

    // Create new blog if author has <10 blogs
    if (blogs.length < 10) {
      await Blog.create({
        title,
        content,
        author: session.user.id,
      });
    } else {
      return NextResponse.json(
        { error: "You have reached the maximum number of blogs" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Blog created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}

