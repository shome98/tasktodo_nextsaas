import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import Category, { ICategory } from "@/models/expenses/category.model";
import { connectToDatabase } from "@/db/connectToDatabase";

export async function GET(request:NextRequest){
    try {
        const session = await getServerSession(authOptions);
                if (!session) {
                    return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve the categories." }, { status: 401 });
                }
                const userId = session?.user.id;
                await connectToDatabase();
                const categories=await Category.find({userId:userId}).lean();
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

