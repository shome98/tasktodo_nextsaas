import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import PaymentMode from "@/models/expenses/paymentmode.model";
import { connectToDatabase } from "@/db/connectToDatabase";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve the payment mode." }, { status: 401 });
        }
        const userId = session?.user.id;
        const { id } = await props.params;
        if (!id) {
            return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 400 });
        }
        await connectToDatabase();
        const paymentMode = await PaymentMode.findOne({ userId, _id: id }).lean();
        if (!paymentMode) {
            return NextResponse.json({ error: "🚫 Failed to retrieve the payment mode." }, { status: 404 });
        }
        return NextResponse.json({ message: "✅ Successfully fetched the payment mode.", paymentMode }, { status: 200 });

    } catch (error) {
        console.error("❌ Error retrieving the payment mode:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to retrieve the payment mode. Please try again." },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to update payment modes." }, { status: 401 });
        }

        const userId = session?.user.id;
        const { id } = await props.params;
        if (!id) {
            return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 400 });
        }

        const body: { name: string } = await request.json();
        if (!body.name) {
            return NextResponse.json({ error: "😠 Please enter a payment mode name to update" }, { status: 400 });
        }

        await connectToDatabase();

        const paymentMode = await PaymentMode.findOneAndUpdate(
            { _id: id, userId },
            { name: body.name },
            { new: true, runValidators: true }
        );
        if (!paymentMode) {
            return NextResponse.json({ error: "🚫 Payment mode not found or you may not have permission." }, { status: 404 });
        }

        return NextResponse.json({ message: "✅ Successfully updated the payment mode.", paymentMode }, { status: 200 });

    } catch (error) {
        console.error("❌ Error updating the payment mode:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to update the payment mode. Please try again." },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to delete payment modes." }, { status: 401 });
        }
        const userId = session?.user.id;
        const { id } = await props.params;
        if (!id) {
            return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 400 });
        }
        await connectToDatabase();

        const deletedPaymentMode = await PaymentMode.findOneAndDelete({ _id: id, userId });
        if (!deletedPaymentMode) {
            return NextResponse.json({ error: "🚫 Failed to delete the payment mode." }, { status: 404 });
        }
        return NextResponse.json({ message: "✅ Successfully deleted the payment mode.", paymentMode: deletedPaymentMode }, { status: 200 });

    } catch (error) {
        console.error("❌ Error deleting the payment mode:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to delete the payment mode. Please try again." },
            { status: 500 }
        );
    }
}