import { getServerSession } from "next-auth";
import {  NextResponse } from "next/server";
import Expense from "@/models/expenses/expense.model";
import ExpenseSummary from "@/models/expenses/expensesummary.model";
import { connectToDatabase } from "@/db/connectToDatabase";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import mongoose from "mongoose";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve the expense summary." }, { status: 401 });
        }

        const userId = session?.user.id;
        await connectToDatabase();
        const userIdObjectId = mongoose.Types.ObjectId.createFromHexString(userId);

        const expenseSummary = await Expense.aggregate([
            { $match: { userId: userIdObjectId } },
            {
                $group: {
                    _id: {
                        category: "$category",
                        paymentMode: "$paymentMode",
                        type: "$type",
                        status: "$status",
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    totalAmount: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id.category",
                    paymentMode: "$_id.paymentMode",
                    type: "$_id.type",
                    status: "$_id.status",
                    month: "$_id.month",
                    year: "$_id.year",
                    totalAmount: 1
                }
            }
        ]);

        if (!expenseSummary) {
            return NextResponse.json({ error: "🚫 Failed to retrieve the expense summary." }, { status: 404 });
        }

        // Save the aggregated data to the ExpenseSummary collection
        await ExpenseSummary.insertMany(expenseSummary.map(summary => ({
            ...summary,
            userId: userIdObjectId
        })));

        return NextResponse.json({ message: "✅ Successfully fetched and stored the expense summary.", expenseSummary }, { status: 200 });

    } catch (error) {
        console.error("❌ Error retrieving the expense summary:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to retrieve the expense summary. Please try again." },
            { status: 500 }
        );
    }
}