import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import PaymentMode, { IPaymentMode } from "@/models/expenses/paymentmode.model";
import { connectToDatabase } from "@/db/connectToDatabase";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve the payment modes." }, { status: 401 });
        }
        const userId = session?.user.id;
        await connectToDatabase();
        const paymentModes = await PaymentMode.find({ userId: userId }).lean();
        if (!paymentModes) {
            return NextResponse.json({ error: "🚫 Failed to retrieve the payment modes." }, { status: 401 });
        }
        return NextResponse.json({ message: "✅ Successfully fetched the payment modes.", paymentModes: paymentModes }, { status: 201 });

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
        if (body.names.length === 0) {
            return NextResponse.json({ error: "😠 Please enter at least one payment mode" }, { status: 401 });
        }
        await connectToDatabase();
        const newPaymentModes = await PaymentMode.create({ names: body.names, userId: userId });
        if (!newPaymentModes) {
            return NextResponse.json({ error: "🚫 Failed to add the payment modes." }, { status: 401 });
        }
        return NextResponse.json({ message: "✅ Successfully added the new payment modes.", paymentModes: newPaymentModes }, { status: 201 });

    } catch (error) {
        console.error("❌ Error adding the payment modes:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to add the payment modes. Please try again." },
            { status: 500 }
        );
    }
}