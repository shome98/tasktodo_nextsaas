import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import Todo, { ITodo } from "@/models/todo.model";
import { connectToDatabase } from "@/db/connectToDatabase";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve the todos." }, { status: 401 });
        }
        const userId = session?.user.id;
        //const userId = "67e051d767ef5cc8fa0a5f83";
        await connectToDatabase();
        const todos: ITodo[] = await Todo.find({ userId: userId });
        if (!todos) {
            return NextResponse.json({ error: "🚫 Failed to retrieve the todos." }, { status: 401 });
        }
        return NextResponse.json({ message:"✅ Successfully fetched the todos.",todos: todos }, { status: 201 });
        
    } catch (error) {
        console.error("❌ Error retrieving the todos:", error);
            return NextResponse.json(
              { error: "⚠️ Oops! Failed to retrieve the todos. Please try again." },
              { status: 500 }
            );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve the todos." }, { status: 401 });
        }
        const userId = session?.user.id;
        //const userId = "67e051d767ef5cc8fa0a5f83";
        //const { title, description } = await request.json();
        
        const body: ITodo = await request.json();
        if (!body.title || !body.description) {
            return NextResponse.json({ error: "😠 Please enter a title or description." }, { status: 401 });
        }
        //const newTodo = await Todo.create({title, description, userId: userId});
        await connectToDatabase();
        const newTodo= await Todo.create({ ...body, userId: userId });
        return NextResponse.json({ message:"✅ Successfully created the new todo.",todo:newTodo }, { status: 201 });
        
    } catch (error) {
        console.error("❌ Error creating the new todo:", error);
            return NextResponse.json(
              { error: "⚠️ Oops! Failed to create the new todo. Please try again." },
              { status: 500 }
            );
    }
}