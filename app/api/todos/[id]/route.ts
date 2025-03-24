import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { connectToDatabase } from "@/db/connectToDatabase";
import Todo, { ITodo } from "@/models/todo.model";

export type Ttodo={
    _id:string;
    title?:string;
    description?:string;
    createdAt?:Date;
    updatedAt?:Date;
    userId?:string;
}

export async function GET(request:NextRequest,props: { params: Promise<{ id: string }> }){
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve the todo." }, { status: 401 });
        }
        const userId = session?.user.id;
        const {id}=await props.params;
        if(!id){
            return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 401 });
        }
        await connectToDatabase();
        const todo=await Todo.findOne({_id:id,userId:userId}).lean();
        if(!todo){
            return NextResponse.json({error:"🚫Could not retrive the todo. Please try again",},{status:401});
        }
        NextResponse.json({message:"😊Successfully retrived the todo.",todo:todo},{status:201});
    } catch (error) {
        console.error("❌ Error retrieving the todo:", error);
        return NextResponse.json(
          { error: "⚠️ Oops! Failed to retrieve the todo. Please try again." },
          { status: 500 }
        );
    }
}