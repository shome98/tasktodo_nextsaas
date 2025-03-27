import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import Expense from "@/models/expenses/expense.model";
import { connectToDatabase } from "@/db/connectToDatabase";
import PaymentMode from "@/models/expenses/paymentmode.model";
import Category from "@/models/expenses/category.model";

const ensuremodels=[Category,PaymentMode];

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve expenses." }, { status: 401 });
        }
        const userId = session?.user.id;
        await connectToDatabase();
        const expenses = await Expense.find({ userId }).populate('category','name').populate('paymentMode','name').lean();
        if (!expenses) {
            return NextResponse.json({ error: "🚫 Failed to retrieve expenses." }, { status: 404 });
        }
        return NextResponse.json({ message: "✅ Successfully fetched the expenses.", expenses }, { status: 200 });

    } catch (error) {
        console.error("❌ Error retrieving the expenses:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to retrieve the expenses. Please try again." },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to add expenses." }, { status: 401 });
        }

        const userId = session?.user.id;
        const body = await request.json();
        if (!body.amount || !body.description || !body.category || !body.paymentMode || !body.type || !body.status) {
            return NextResponse.json({ error: "😠 Please provide all required fields." }, { status: 400 });
        }

        await connectToDatabase();
        const newExpense = await Expense.create({ ...body, userId });
        return NextResponse.json({ message: "✅ Successfully added the new expense.", expense: newExpense }, { status: 201 });

    } catch (error) {
        console.error("❌ Error adding the expense:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to add the expense. Please try again." },
            { status: 500 }
        );
    }
}