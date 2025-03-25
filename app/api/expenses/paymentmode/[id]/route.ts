import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import PaymentMode, { IPaymentMode } from "@/models/expenses/paymentmode.model";
import { connectToDatabase } from "@/db/connectToDatabase";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to retrieve the payment modes." }, { status: 401 });
        }
        const userId = session?.user.id;
        const { id } = await props.params;
        if (!id) {
            return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 401 });
        }
        await connectToDatabase();
        const paymentModes = await PaymentMode.find({ userId: userId, _id: id }).lean();
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

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "🚫 Unauthorized. Please log in to update payment modes." }, { status: 401 });
        }
        const userId = session?.user.id;
        const { id } = await props.params;
        if (!id) {
            return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 401 });
        }
        const body: IPaymentMode = await request.json();
        if (body.names.length === 0) {
            return NextResponse.json({ error: "😠 Please enter at least one payment mode to update" }, { status: 401 });
        }
        await connectToDatabase();

        const paymentMode = await PaymentMode.findOne({ _id: id, userId: userId });
        if (!paymentMode) {
            return NextResponse.json({ error: "🚫 Payment mode not found or you may not have permission." }, { status: 404 });
        }

        // Add new names to the existing names array
        body.names.forEach(newName => {
            if (!paymentMode.names.includes(newName)) {
                paymentMode.names.push(newName);
            }
        });

        await paymentMode.save();

        return NextResponse.json({ message: "✅ Successfully updated the payment modes.", paymentModes: paymentMode }, { status: 200 });

    } catch (error) {
        console.error("❌ Error updating the payment modes:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to update the payment modes. Please try again." },
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
            return NextResponse.json({ error: "🚫 Not a valid param!" }, { status: 401 });
        }
        const body: { names: string[] } = await request.json();
        if (body.names.length === 0) {
            return NextResponse.json({ error: "😠 Please enter at least one payment mode to delete" }, { status: 401 });
        }
        await connectToDatabase();

        const deletedPaymentMode = await PaymentMode.findOneAndUpdate(
            { _id: id, userId: userId },
            { $pullAll: { names: body.names } },
            { new: true }
        );
        if (!deletedPaymentMode) {
            return NextResponse.json({ error: "🚫 Failed to delete the payment modes." }, { status: 401 });
        }
        return NextResponse.json({ message: "✅ Successfully deleted payment modes.", paymentModes: deletedPaymentMode }, { status: 201 });

    } catch (error) {
        console.error("❌ Error deleting the payment modes:", error);
        return NextResponse.json(
            { error: "⚠️ Oops! Failed to delete the payment modes. Please try again." },
            { status: 500 }
        );
    }
}