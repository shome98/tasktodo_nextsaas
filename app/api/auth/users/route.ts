import { getServerSession } from "next-auth";
import {  NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/authOptions";
import User from "@/models/user.model";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user.id;
        const userData = await User.findById(userId);
        if (!userData) {
            return NextResponse.json({ error: "❌ Error retrieving the user details!" }, { status: 404 });
        }
        NextResponse.json({ data: userData }, { status: 201 });
    } catch (error) {
        console.error("❌ Error retrieving the user details:", error);
    return NextResponse.json(
      { error: "⚠️ Oops! Failed to retrieve the user details. Please try again." },
      { status: 500 }
    );
    }
}