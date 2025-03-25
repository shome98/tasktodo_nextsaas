import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Category, { ICategory } from "@/models/expenses/category.model";
import { connectToDatabase } from "@/db/connectToDatabase";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET(request:NextRequest,props: { params: Promise<{ id: string }> }){
    try {
        const session = await getServerSession(authOptions);
                if (!session) {
                    return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve the categories." }, { status: 401 });
                }
                const userId = session?.user.id;
                const {id}=await props.params;
                if(!id){
                    return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 401 });
                }
                await connectToDatabase();
                const categories=await Category.find({userId:userId,_id:id}).lean();
                if(!categories){
                    return NextResponse.json({ error: "🚫 Failed to retrieve the categories." }, { status: 401 });
                }
                return NextResponse.json({ message:"✅ Successfully fetched the categories.",categories: categories }, { status: 201 });

    } catch (error) {
        console.error("❌ Error retrieving the categories:", error);
            return NextResponse.json(
              { error: "⚠️ Oops! Failed to retrieve the categories. Please try again." },
              { status: 500 }
            );
    }
}

export async function PUT(request:NextRequest,props: { params: Promise<{ id: string }> }){
    try {
        const session = await getServerSession(authOptions);
                if (!session) {
                    return NextResponse.json({ error: "🚫 Unauthorized. Please log in to update categories." }, { status: 401 });
                }
                const userId = session?.user.id;
                const {id}=await props.params;
        if(!id){
            return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 401 });
        }
                const body:ICategory=await request.json();
                if(body.names.length===0){
                    return NextResponse.json({ error: "😠 Please enter atleast one category to update" }, { status: 401 });
                }
                await connectToDatabase();
                //todo add individual new category only like
                //const newcategories=await Category.findOneAndUpdate({_id:id,userId:userId},{},{new:true});
                // Add new names to the existing names array
        //body.names.forEach(newName => {if (!category.names.includes(newName)) { category.names.push(newName)}});

        // await category.save();
                const newcategories=await Category.findOneAndUpdate({_id:id,userId:userId},{...body},{new:true});
                if(!newcategories){
                    return NextResponse.json({ error: "🚫 Failed to update the categories." }, { status: 401 });
                }
                return NextResponse.json({ message:"✅ Successfully updated the new categories.",categories: newcategories }, { status: 201 });

    } catch (error) {
        console.error("❌ Error addining the categories:", error);
            return NextResponse.json(
              { error: "⚠️ Oops! Failed to update the categories. Please try again." },
              { status: 500 }
            );
    }
}

export async function DELETE(request:NextRequest,props: { params: Promise<{ id: string }> }){
    try {
        const session = await getServerSession(authOptions);
                if (!session) {
                    return NextResponse.json({ error: "🚫 Unauthorized. Please log in to delete categories." }, { status: 401 });
                }
                const userId = session?.user.id;
                const {id}=await props.params;
        if(!id){
            return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 401 });
        }
                const body:{names:string[]}=await request.json();
                if(body.names.length===0){
                    return NextResponse.json({ error: "😠 Please enter atleast one category to delete" }, { status: 401 });
                }
                await connectToDatabase();
                //whole category delete
                //const deletedCategory = await Category.findOneAndUpdate({ _id: id, userId: userId });
                const deletedCategory = await Category.findOneAndUpdate(
                    { _id: id, userId: userId },
                    { $pullAll: { names: body.names} },
                    { new: true }
                );
                if(!deletedCategory){
                    return NextResponse.json({ error: "🚫 Failed to delete the categories." }, { status: 401 });
                }
                return NextResponse.json({ message:"✅ Successfully delete categories.",categories: deletedCategory }, { status: 201 });

    } catch (error) {
        console.error("❌ Error addining the categories:", error);
            return NextResponse.json(
              { error: "⚠️ Oops! Failed to add the categories. Please try again." },
              { status: 500 }
            );
    }
}