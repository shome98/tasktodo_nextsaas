import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import Category, { ICategory } from "@/models/expenses/category.model";
import { connectToDatabase } from "@/db/connectToDatabase";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve the categories." }, { status: 401 });
        }
        const userId = session?.user.id;
        await connectToDatabase();
        const categories = await Category.find({ userId }).lean();
        if (!categories) {
            return NextResponse.json({ error: "🚫 Failed to retrieve the categories." }, { status: 404 });
        }
        return NextResponse.json({ message: "✅ Successfully fetched the categories.", categories }, { status: 200 });

    } catch (error) {
        console.error("❌ Error retrieving the categories:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to retrieve the categories. Please try again." },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to add categories." }, { status: 401 });
        }
        const userId = session?.user.id;
        const body: ICategory = await request.json();
        if (!body.name) {
            return NextResponse.json({ error: "😠 Please enter a category name" }, { status: 400 });
        }
        await connectToDatabase();
        const newCategory = await Category.create({ name: body.name, userId });
        return NextResponse.json({ message: "✅ Successfully added the new category.", category: newCategory }, { status: 201 });

    } catch (error) {
        console.error("❌ Error adding the category:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to add the category. Please try again." },
            { status: 500 }
        );
    }
}