import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Expense from "@/models/expenses/expense.model";
import { connectToDatabase } from "@/db/connectToDatabase";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve the expense." }, { status: 401 });
        }

        const userId = session?.user.id;
        const { id } = await props.params;
        if (!id) {
            return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 401 });
        }

        await connectToDatabase();
        const expense = await Expense.findOne({ userId: userId, _id: id }).lean();
        if (!expense) {
            return NextResponse.json({ error: "🚫 Failed to retrieve the expense." }, { status: 404 });
        }
        return NextResponse.json({ message: "✅ Successfully fetched the expense.", expense: expense }, { status: 200 });

    } catch (error) {
        console.error("❌ Error retrieving the expense:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to retrieve the expense. Please try again." },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to update expenses." }, { status: 401 });
        }

        const userId = session?.user.id;
        const { id } = await props.params;
        if (!id) {
            return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 401 });
        }

        const body = await request.json();
        if (!body.amount || !body.description || !body.category || !body.paymentMode || !body.type || !body.status) {
            return NextResponse.json({ error: "😠 Please provide all required fields." }, { status: 401 });
        }

        await connectToDatabase();

        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: id, userId: userId },
            { ...body },
            { new: true }
        );
        if (!updatedExpense) {
            return NextResponse.json({ error: "🚫 Failed to update the expense." }, { status: 404 });
        }

        return NextResponse.json({ message: "✅ Successfully updated the expense.", expense: updatedExpense }, { status: 200 });

    } catch (error) {
        console.error("❌ Error updating the expense:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to update the expense. Please try again." },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to delete expenses." }, { status: 401 });
        }

        const userId = session?.user.id;
        const { id } = await props.params;
        if (!id) {
            return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 401 });
        }

        await connectToDatabase();

        const deletedExpense = await Expense.findOneAndDelete({ _id: id, userId: userId });
        if (!deletedExpense) {
            return NextResponse.json({ error: "🚫 Failed to delete the expense." }, { status: 404 });
        }

        return NextResponse.json({ message: "✅ Successfully deleted the expense.", expense: deletedExpense }, { status: 200 });

    } catch (error) {
        console.error("❌ Error deleting the expense:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to delete the expense. Please try again." },
            { status: 500 }
        );
    }
}