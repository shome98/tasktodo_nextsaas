```
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Expense from "@/models/expenses/expense.model";
import ExpenseSummary from "@/models/expenses/expensesummary.model";
import { connectToDatabase } from "@/db/connectToDatabase";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to add an expense." }, { status: 401 });
        }

        const { amount, description, category, paymentMode, type, status } = await request.json();
        const userId = session?.user.id;
        await connectToDatabase();
        const userIdObjectId = mongoose.Types.ObjectId.createFromHexString(userId);

        const newExpense = new Expense({
            amount,
            description,
            category,
            paymentMode,
            type,
            status,
            userId: userIdObjectId
        });

        await newExpense.save();

        // Update the expense summary
        const month = newExpense.createdAt.getMonth() + 1;
        const year = newExpense.createdAt.getFullYear();

        await ExpenseSummary.updateOne(
            {
                category: newExpense.category,
                paymentMode: newExpense.paymentMode,
                type: newExpense.type,
                status: newExpense.status,
                month,
                year,
                userId: userIdObjectId
            },
            {
                $inc: { totalAmount: newExpense.amount }
            },
            { upsert: true }
        );

        return NextResponse.json({ message: "✅ Successfully added the expense and updated the summary.", newExpense }, { status: 201 });

    } catch (error) {
        console.error("❌ Error adding the expense:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to add the expense. Please try again." },
            { status: 500 }
        );
    }
}


export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to update an expense." }, { status: 401 });
        }

        const { id, amount, description, category, paymentMode, type, status } = await request.json();
        const userId = session?.user.id;
        await connectToDatabase();
        const userIdObjectId = mongoose.Types.ObjectId.createFromHexString(userId);

        const existingExpense = await Expense.findById(id);
        if (!existingExpense) {
            return NextResponse.json({ error: "🚫 Expense not found." }, { status: 404 });
        }

        const oldAmount = existingExpense.amount;
        const oldCategory = existingExpense.category;
        const oldPaymentMode = existingExpense.paymentMode;
        const oldType = existingExpense.type;
        const oldStatus = existingExpense.status;
        const oldMonth = existingExpense.createdAt.getMonth() + 1;
        const oldYear = existingExpense.createdAt.getFullYear();

        existingExpense.amount = amount;
        existingExpense.description = description;
        existingExpense.category = category;
        existingExpense.paymentMode = paymentMode;
        existingExpense.type = type;
        existingExpense.status = status;

        await existingExpense.save();

        // Update the old summary
        await ExpenseSummary.updateOne(
            {
                category: oldCategory,
                paymentMode: oldPaymentMode,
                type: oldType,
                status: oldStatus,
                month: oldMonth,
                year: oldYear,
                userId: userIdObjectId
            },
            {
                $inc: { totalAmount: -oldAmount }
            }
        );

        // Update the new summary
        const newMonth = existingExpense.createdAt.getMonth() + 1;
        const newYear = existingExpense.createdAt.getFullYear();

        await ExpenseSummary.updateOne(
            {
                category: existingExpense.category,
                paymentMode: existingExpense.paymentMode,
                type: existingExpense.type,
                status: existingExpense.status,
                month: newMonth,
                year: newYear,
                userId: userIdObjectId
            },
            {
                $inc: { totalAmount: existingExpense.amount }
            },
            { upsert: true }
        );

        return NextResponse.json({ message: "✅ Successfully updated the expense and summary.", existingExpense }, { status: 200 });

    } catch (error) {
        console.error("❌ Error updating the expense:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to update the expense. Please try again." },
            { status: 500 }
        );
    }
}


export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to delete an expense." }, { status: 401 });
        }

        const { id } = await request.json();
        const userId = session?.user.id;
        await connectToDatabase();
        const userIdObjectId = mongoose.Types.ObjectId.createFromHexString(userId);

        const existingExpense = await Expense.findById(id);
        if (!existingExpense) {
            return NextResponse.json({ error: "🚫 Expense not found." }, { status: 404 });
        }

        const oldAmount = existingExpense.amount;
        const oldCategory = existingExpense.category;
        const oldPaymentMode = existingExpense.paymentMode;
        const oldType = existingExpense.type;
        const oldStatus = existingExpense.status;
        const oldMonth = existingExpense.createdAt.getMonth() + 1;
        const oldYear = existingExpense.createdAt.getFullYear();

        await existingExpense.remove();

        // Update the summary
        await ExpenseSummary.updateOne(
            {
                category: oldCategory,
                paymentMode: oldPaymentMode,
                type: oldType,
                status: oldStatus,
                month: oldMonth,
                year: oldYear,
                userId: userIdObjectId
            },
            {
                $inc: { totalAmount: -oldAmount }
            }
        );

        return NextResponse.json({ message: "✅ Successfully deleted the expense and updated the summary." }, { status: 200 });

    } catch (error) {
        console.error("❌ Error deleting the expense:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to delete the expense. Please try again." },
            { status: 500 }
        );
    }
}




new 

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to add an expense." }, { status: 401 });
        }

        const { amount, description, category, paymentMode, type, status } = await request.json();
        const userId = session?.user.id;
        await connectToDatabase();
        const userIdObjectId = mongoose.Types.ObjectId.createFromHexString(userId);

        const newExpense = new Expense({
            amount,
            description,
            category,
            paymentMode,
            type,
            status,
            userId: userIdObjectId
        });

        await newExpense.save();

        // Update the expense summary
        const month = newExpense.createdAt.getMonth() + 1;
        const year = newExpense.createdAt.getFullYear();

        await ExpenseSummary.updateOne(
            {
                category: newExpense.category,
                paymentMode: newExpense.paymentMode,
                type: newExpense.type,
                status: newExpense.status,
                month,
                year,
                userId: userIdObjectId
            },
            {
                $inc: { totalAmount: newExpense.amount }
            },
            { upsert: true }
        );

        return NextResponse.json({ message: "✅ Successfully added the expense and updated the summary.", newExpense }, { status: 201 });

    } catch (error) {
        console.error("❌ Error adding the expense:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to add the expense. Please try again." },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to update an expense." }, { status: 401 });
        }

        const { id, amount, description, category, paymentMode, type, status } = await request.json();
        const userId = session?.user.id;
        await connectToDatabase();
        const userIdObjectId = mongoose.Types.ObjectId.createFromHexString(userId);

        const existingExpense = await Expense.findById(id);
        if (!existingExpense) {
            return NextResponse.json({ error: "🚫 Expense not found." }, { status: 404 });
        }

        const oldAmount = existingExpense.amount;
        const oldCategory = existingExpense.category;
        const oldPaymentMode = existingExpense.paymentMode;
        const oldType = existingExpense.type;
        const oldStatus = existingExpense.status;
        const oldMonth = existingExpense.createdAt.getMonth() + 1;
        const oldYear = existingExpense.createdAt.getFullYear();

        existingExpense.amount = amount;
        existingExpense.description = description;
        existingExpense.category = category;
        existingExpense.paymentMode = paymentMode;
        existingExpense.type = type;
        existingExpense.status = status;

        await existingExpense.save();

        // Update the old summary
        await ExpenseSummary.updateOne(
            {
                category: oldCategory,
                paymentMode: oldPaymentMode,
                type: oldType,
                status: oldStatus,
                month: oldMonth,
                year: oldYear,
                userId: userIdObjectId
            },
            {
                $inc: { totalAmount: -oldAmount }
            }
        );

        // Update the new summary
        const newMonth = existingExpense.createdAt.getMonth() + 1;
        const newYear = existingExpense.createdAt.getFullYear();

        await ExpenseSummary.updateOne(
            {
                category: existingExpense.category,
                paymentMode: existingExpense.paymentMode,
                type: existingExpense.type,
                status: existingExpense.status,
                month: newMonth,
                year: newYear,
                userId: userIdObjectId
            },
            {
                $inc: { totalAmount: existingExpense.amount }
            },
            { upsert: true }
        );

        return NextResponse.json({ message: "✅ Successfully updated the expense and summary.", existingExpense }, { status: 200 });

    } catch (error) {
        console.error("❌ Error updating the expense:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to update the expense. Please try again." },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to delete an expense." }, { status: 401 });
        }

        const { id } = await request.json();
        const userId = session?.user.id;
        await connectToDatabase();
        const userIdObjectId = mongoose.Types.ObjectId.createFromHexString(userId);

        const existingExpense = await Expense.findById(id);
        if (!existingExpense) {
            return NextResponse.json({ error: "🚫 Expense not found." }, { status: 404 });
        }

        const oldAmount = existingExpense.amount;
        const oldCategory = existingExpense.category;
        const oldPaymentMode = existingExpense.paymentMode;
        const oldType = existingExpense.type;
        const oldStatus = existingExpense.status;
        const oldMonth = existingExpense.createdAt.getMonth() + 1;
        const oldYear = existingExpense.createdAt.getFullYear();

        await existingExpense.remove();

        // Update the summary
        await ExpenseSummary.updateOne(
            {
                category: oldCategory,
                paymentMode: oldPaymentMode,
                type: oldType,
                status: oldStatus,
                month: oldMonth,
                year: oldYear,
                userId: userIdObjectId
            },
            {
                $inc: { totalAmount: -oldAmount }
            }
        );

        return NextResponse.json({ message: "✅ Successfully deleted the expense and updated the summary." }, { status: 200 });

    } catch (error) {
        console.error("❌ Error deleting the expense:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to delete the expense. Please try again." },
            { status: 500 }
        );
    }
}
```

data 
Got it! If the month is the same for all entries, here's the updated expense summary for a specific user, covering 3 categories with 2 different payment methods:

### Aggregated Expense Summary
```json
[
    {
        "_id": 0,
        "category": "Groceries",
        "paymentMode": "Credit Card",
        "type": "debit",
        "status": "paid",
        "month": 1,
        "year": 2023,
        "totalAmount": 250
    },
    {
        "_id": 0,
        "category": "Transport",
        "paymentMode": "Cash",
        "type": "debit",
        "status": "paid",
        "month": 1,
        "year": 2023,
        "totalAmount": 50
    },
    {
        "_id": 0,
        "category": "Utilities",
        "paymentMode": "Bank Transfer",
        "type": "debit",
        "status": "due",
        "month": 1,
        "year": 2023,
        "totalAmount": 200
    },
    {
        "_id": 0,
        "category": "Utilities",
        "paymentMode": "Bank Transfer",
        "type": "debit",
        "status": "paid",
        "month": 1,
        "year": 2023,
        "totalAmount": 75
    }
]
```

This summary includes:
- **Groceries** paid with **Credit Card** in January 2023, totaling **₹250**.
- **Transport** paid with **Cash** in January 2023, totaling **₹50**.
- **Utilities** paid with **Bank Transfer** in January 2023, with one entry due totaling **₹200** and another entry paid totaling **₹75**.

If you need further customization or additional examples, feel free to let me know!

```
Here's the updated expense summary for a specific user, including the new expense for groceries in month 1 of 350 using a credit card:

### Updated Aggregated Expense Summary
```json
[
    {
        "_id": 0,
        "category": "Groceries",
        "paymentMode": "Credit Card",
        "type": "debit",
        "status": "paid",
        "month": 1,
        "year": 2023,
        "totalAmount": 600
    },
    {
        "_id": 0,
        "category": "Transport",
        "paymentMode": "Cash",
        "type": "debit",
        "status": "paid",
        "month": 1,
        "year": 2023,
        "totalAmount": 50
    },
    {
        "_id": 0,
        "category": "Utilities",
        "paymentMode": "Bank Transfer",
        "type": "debit",
        "status": "due",
        "month": 1,
        "year": 2023,
        "totalAmount": 200
    },
    {
        "_id": 0,
        "category": "Utilities",
        "paymentMode": "Bank Transfer",
        "type": "debit",
        "status": "paid",
        "month": 1,
        "year": 2023,
        "totalAmount": 75
    }
]
```

This summary now includes:
- **Groceries** paid with **Credit Card** in January 2023, totaling **₹600** (including the new expense of ₹350).
- **Transport** paid with **Cash** in January 2023, totaling **₹50**.
- **Utilities** paid with **Bank Transfer** in January 2023, with one entry due totaling **₹200** and another entry paid totaling **₹75**.

If you need further customization or additional examples, feel free to let me know!

Sure! Here are the routes to handle adding, updating, and deleting expenses, ensuring that the `ExpenseSummary` is updated accordingly for a specific user:

### 1. Adding a New Expense

When adding a new expense, you update the `ExpenseSummary` by incrementing the `totalAmount` for the relevant fields:

```javascript
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Expense from "@/models/expenses/expense.model";
import ExpenseSummary from "@/models/expenses/expensesummary.model";
import { connectToDatabase } from "@/db/connectToDatabase";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to add an expense." }, { status: 401 });
        }

        const { amount, description, category, paymentMode, type, status } = await request.json();
        const userId = session?.user.id;
        await connectToDatabase();
        const userIdObjectId = mongoose.Types.ObjectId.createFromHexString(userId);

        const newExpense = new Expense({
            amount,
            description,
            category,
            paymentMode,
            type,
            status,
            userId: userIdObjectId
        });

        await newExpense.save();

        // Update the expense summary
        const month = newExpense.createdAt.getMonth() + 1;
        const year = newExpense.createdAt.getFullYear();

        await ExpenseSummary.updateOne(
            {
                category: newExpense.category,
                paymentMode: newExpense.paymentMode,
                type: newExpense.type,
                status: newExpense.status,
                month,
                year,
                userId: userIdObjectId
            },
            {
                $inc: { totalAmount: newExpense.amount }
            },
            { upsert: true }
        );

        return NextResponse.json({ message: "✅ Successfully added the expense and updated the summary.", newExpense }, { status: 201 });

    } catch (error) {
        console.error("❌ Error adding the expense:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to add the expense. Please try again." },
            { status: 500 }
        );
    }
}
```

### 2. Updating an Existing Expense

When updating an existing expense, you adjust the `ExpenseSummary` by decrementing the `totalAmount` for the old values and incrementing it for the new values:

```javascript
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to update an expense." }, { status: 401 });
        }

        const { id, amount, description, category, paymentMode, type, status } = await request.json();
        const userId = session?.user.id;
        await connectToDatabase();
        const userIdObjectId = mongoose.Types.ObjectId.createFromHexString(userId);

        const existingExpense = await Expense.findById(id);
        if (!existingExpense) {
            return NextResponse.json({ error: "🚫 Expense not found." }, { status: 404 });
        }

        const oldAmount = existingExpense.amount;
        const oldCategory = existingExpense.category;
        const oldPaymentMode = existingExpense.paymentMode;
        const oldType = existingExpense.type;
        const oldStatus = existingExpense.status;
        const oldMonth = existingExpense.createdAt.getMonth() + 1;
        const oldYear = existingExpense.createdAt.getFullYear();

        existingExpense.amount = amount;
        existingExpense.description = description;
        existingExpense.category = category;
        existingExpense.paymentMode = paymentMode;
        existingExpense.type = type;
        existingExpense.status = status;

        await existingExpense.save();

        // Update the old summary
        await ExpenseSummary.updateOne(
            {
                category: oldCategory,
                paymentMode: oldPaymentMode,
                type: oldType,
                status: oldStatus,
                month: oldMonth,
                year: oldYear,
                userId: userIdObjectId
            },
            {
                $inc: { totalAmount: -oldAmount }
            }
        );

        // Update the new summary
        const newMonth = existingExpense.createdAt.getMonth() + 1;
        const newYear = existingExpense.createdAt.getFullYear();

        await ExpenseSummary.updateOne(
            {
                category: existingExpense.category,
                paymentMode: existingExpense.paymentMode,
                type: existingExpense.type,
                status: existingExpense.status,
                month: newMonth,
                year: newYear,
                userId: userIdObjectId
            },
            {
                $inc: { totalAmount: existingExpense.amount }
            },
            { upsert: true }
        );

        return NextResponse.json({ message: "✅ Successfully updated the expense and summary.", existingExpense }, { status: 200 });

    } catch (error) {
        console.error("❌ Error updating the expense:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to update the expense. Please try again." },
            { status: 500 }
        );
    }
}
```

### 3. Deleting an Expense

When deleting an expense, you update the `ExpenseSummary` by decrementing the `totalAmount` for the relevant fields:

```javascript
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to delete an expense." }, { status: 401 });
        }

        const { id } = await request.json();
        const userId = session?.user.id;
        await connectToDatabase();
        const userIdObjectId = mongoose.Types.ObjectId.createFromHexString(userId);

        const existingExpense = await Expense.findById(id);
        if (!existingExpense) {
            return NextResponse.json({ error: "🚫 Expense not found." }, { status: 404 });
        }

        const oldAmount = existingExpense.amount;
        const oldCategory = existingExpense.category;
        const oldPaymentMode = existingExpense.paymentMode;
        const oldType = existingExpense.type;
        const oldStatus = existingExpense.status;
        const oldMonth = existingExpense.createdAt.getMonth() + 1;
        const oldYear = existingExpense.createdAt.getFullYear();

        await existingExpense.remove();

        // Update the summary
        await ExpenseSummary.updateOne(
            {
                category: oldCategory,
                paymentMode: oldPaymentMode,
                type: oldType,
                status: oldStatus,
                month: oldMonth,
                year: oldYear,
                userId: userIdObjectId
            },
            {
                $inc: { totalAmount: -oldAmount }
            }
        );

        return NextResponse.json({ message: "✅ Successfully deleted the expense and updated the summary." }, { status: 200 });

    } catch (error) {
        console.error("❌ Error deleting the expense:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to delete the expense. Please try again." },
            { status: 500 }
        );
    }
}
```

### Summary
In each of these operations, you use the user's ID along with the relevant fields (category, payment mode, type, status, month, and year) to find and update the corresponding `ExpenseSummary` document. This ensures that the summary data is always accurate and up-to-date for each user. If you have any more questions or need further assistance, feel free to ask!


To filter expenses by date, you can add query parameters to your routes to specify the date range. This allows you to retrieve expenses within a specific period. Here's how you can implement this:

### 1. Filtering Expenses by Date

You can create a route that accepts query parameters for the start and end dates. Here's an example:

```javascript
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Expense from "@/models/expenses/expense.model";
import { connectToDatabase } from "@/db/connectToDatabase";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve expenses." }, { status: 401 });
        }

        const userId = session?.user.id;
        await connectToDatabase();
        const userIdObjectId = mongoose.Types.ObjectId.createFromHexString(userId);

        const url = new URL(request.url);
        const startDate = new Date(url.searchParams.get("startDate"));
        const endDate = new Date(url.searchParams.get("endDate"));

        const expenses = await Expense.find({
            userId: userIdObjectId,
            createdAt: { $gte: startDate, $lte: endDate }
        });

        return NextResponse.json({ message: "✅ Successfully retrieved expenses.", expenses }, { status: 200 });

    } catch (error) {
        console.error("❌ Error retrieving expenses:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to retrieve expenses. Please try again." },
            { status: 500 }
        );
    }
}
```

### 2. Filtering Expense Summary by Date

Similarly, you can filter the expense summary by date. Here's an example:

```javascript
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve the expense summary." }, { status: 401 });
        }

        const userId = session?.user.id;
        await connectToDatabase();
        const userIdObjectId = mongoose.Types.ObjectId.createFromHexString(userId);

        const url = new URL(request.url);
        const startDate = new Date(url.searchParams.get("startDate"));
        const endDate = new Date(url.searchParams.get("endDate"));

        const expenseSummary = await ExpenseSummary.aggregate([
            { $match: { userId: userIdObjectId, createdAt: { $gte: startDate, $lte: endDate } } },
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
                    totalAmount: { $sum: "$totalAmount" }
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

        return NextResponse.json({ message: "✅ Successfully retrieved the expense summary.", expenseSummary }, { status: 200 });

    } catch (error) {
        console.error("❌ Error retrieving the expense summary:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to retrieve the expense summary. Please try again." },
            { status: 500 }
        );
    }
}
```

### Example Usage

To use these routes, you can make a GET request with query parameters for the start and end dates. For example:

```
GET /api/expenses?startDate=2023-01-01&endDate=2023-01-31
GET /api/expense-summary?startDate=2023-01-01&endDate=2023-01-31
```

This will filter the expenses and expense summary for the specified date range.

If you need further customization or additional examples, feel free to let me know!