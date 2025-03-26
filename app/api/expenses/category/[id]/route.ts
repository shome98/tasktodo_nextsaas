import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/expenses/category.model";
import { connectToDatabase } from "@/db/connectToDatabase";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve the category." }, { status: 401 });
        }
        const userId = session?.user.id;
        const { id } = await props.params;
        if (!id) {
            return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 400 });
        }
        await connectToDatabase();
        const category = await Category.findOne({ userId, _id: id }).lean();
        if (!category) {
            return NextResponse.json({ error: "🚫 Failed to retrieve the category." }, { status: 404 });
        }
        return NextResponse.json({ message: "✅ Successfully fetched the category.", category }, { status: 200 });

    } catch (error) {
        console.error("❌ Error retrieving the category:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to retrieve the category. Please try again." },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to update categories." }, { status: 401 });
        }

        const userId = session?.user.id;
        const { id } = await props.params;
        if (!id) {
            return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 400 });
        }

        const body: { name: string } = await request.json();
        if (!body.name) {
            return NextResponse.json({ error: "😠 Please enter a category name to update" }, { status: 400 });
        }

        await connectToDatabase();

        const category = await Category.findOneAndUpdate(
            { _id: id, userId },
            { name: body.name },
            { new: true, runValidators: true }
        );
        if (!category) {
            return NextResponse.json({ error: "🚫 Category not found or you may not have permission." }, { status: 404 });
        }

        return NextResponse.json({ message: "✅ Successfully updated the category.", category }, { status: 200 });

    } catch (error) {
        console.error("❌ Error updating the category:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to update the category. Please try again." },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to delete categories." }, { status: 401 });
        }
        const userId = session?.user.id;
        const { id } = await props.params;
        if (!id) {
            return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 400 });
        }
        await connectToDatabase();

        const deletedCategory = await Category.findOneAndDelete({ _id: id, userId });
        if (!deletedCategory) {
            return NextResponse.json({ error: "🚫 Failed to delete the category." }, { status: 404 });
        }
        return NextResponse.json({ message: "✅ Successfully deleted the category.", category: deletedCategory }, { status: 200 });

    } catch (error) {
        console.error("❌ Error deleting the category:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to delete the category. Please try again." },
            { status: 500 }
        );
    }
}