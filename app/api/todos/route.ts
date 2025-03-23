import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import Todo, { ITodo } from "@/models/todo.model";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve the todos." }, { status: 401 });
        }
        const userId = session?.user.id;
        const todos: ITodo[] = await Todo.find({ userId: userId });
        if (!todos) {
            return NextResponse.json({ error: "🚫 Failed to retrieve the todos." }, { status: 401 });
        }
        return NextResponse.json({ todos: todos }, { status: 201 });
        
    } catch (error) {
        console.error("❌ Error retrieving the todos:", error);
            return NextResponse.json(
              { error: "⚠️ Oops! Failed to retrieve the todos. Please try again." },
              { status: 500 }
            );
    }
}