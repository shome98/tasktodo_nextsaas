import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { connectToDatabase } from "@/db/connectToDatabase";
import Todo, { ITodo } from "@/models/todo.model";

export type Ttodo={
    _id:string;
    title?:string;
    description?:string;
    completed:boolean;
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
        return NextResponse.json({message:"😊Successfully retrived the todo.",todo:todo},{status:201});
    } catch (error) {
        console.error("❌ Error retrieving the todo:", error);
        return NextResponse.json(
          { error: "⚠️ Oops! Failed to retrieve the todo. Please try again." },
          { status: 500 }
        );
    }
}

export async function PUT(request:NextRequest,props: { params: Promise<{ id: string }> }){
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve the todo." }, { status: 401 });
        }
        const userId = session?.user.id;
        const {id}=await props.params;
        const body:ITodo=await request.json();
        if(!id){
            return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 401 });
        }
        await connectToDatabase();
        const updatedTodo=await Todo.findOneAndUpdate({_id:id,userId:userId},{...body},{new:true}).lean();

        if(!updatedTodo){
            return NextResponse.json({error:"🚫Could not update the todo. Please try again",},{status:401});
        }
        return NextResponse.json({message:"😊Successfully updated the todo.",todo:updatedTodo},{status:201});
    } catch (error) {
        console.error("❌ Error updating the todo:", error);
        return NextResponse.json(
          { error: "⚠️ Oops! Failed to update the todo. Please try again." },
          { status: 500 }
        );
    }
}

export async function DELETE(request:NextRequest,props: { params: Promise<{ id: string }> }){
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
        const deletedTodo=await Todo.findOneAndDelete({_id:id,userId:userId}).lean();
        if(!deletedTodo){
            return NextResponse.json({error:"🚫Could not retrive the todo. Please try again",},{status:401});
        }
        return NextResponse.json({message:"😊Successfully deleted the todo.",todo:deletedTodo},{status:201});
    } catch (error) {
        console.error("❌ Error deleting the todo:", error);
        return NextResponse.json(
          { error: "⚠️ Oops! Failed to delete the todo. Please try again." },
          { status: 500 }
        );
    }
}

//toggle complete using patch
export async function PATCH(request:NextRequest,props: { params: Promise<{ id: string }> }){
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
        const {completed}:ITodo=await request.json();
        await connectToDatabase();
        const todo=await Todo.findOneAndUpdate({_id:id,userId:userId},{completed:completed}).lean();
        if(!todo){
            return NextResponse.json({error:"🚫Could not update the todo. Please try again",},{status:401});
        }
        return NextResponse.json({message:"😊Successfully updated the todo.",todo:todo},{status:201});
    } catch (error) {
        console.error("❌ Error updating the todo:", error);
        return NextResponse.json(
          { error: "⚠️ Oops! Failed to update the todo. Please try again." },
          { status: 500 }
        );
    }
}