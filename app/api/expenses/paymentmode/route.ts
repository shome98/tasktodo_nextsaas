import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import PaymentMode, { IPaymentMode } from "@/models/expenses/paymentmode.model";
import { connectToDatabase } from "@/db/connectToDatabase";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve the payment modes." }, { status: 401 });
        }
        const userId = session?.user.id;
        await connectToDatabase();
        const paymentModes = await PaymentMode.find({ userId }).lean();
        if (!paymentModes) {
            return NextResponse.json({ error: "🚫 Failed to retrieve the payment modes." }, { status: 404 });
        }
        return NextResponse.json({ message: "✅ Successfully fetched the payment modes.", paymentModes }, { status: 200 });

    } catch (error) {
        console.error("❌ Error retrieving the payment modes:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to retrieve the payment modes. Please try again." },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to add payment modes." }, { status: 401 });
        }
        const userId = session?.user.id;
        const body: IPaymentMode = await request.json();
        if (!body.name) {
            return NextResponse.json({ error: "😠 Please enter a payment mode name" }, { status: 400 });
        }
        await connectToDatabase();
        const newPaymentMode = await PaymentMode.create({ name: body.name, userId });
        return NextResponse.json({ message: "✅ Successfully added the new payment mode.", paymentMode: newPaymentMode }, { status: 201 });

    } catch (error) {
        console.error("❌ Error adding the payment mode:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to add the payment mode. Please try again." },
            { status: 500 }
        );
    }
}