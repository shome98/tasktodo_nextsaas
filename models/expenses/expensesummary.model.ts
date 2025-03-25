import mongoose, { Document, models, Schema } from "mongoose";

export interface IExpenseSummary extends Document {
    category: string | Schema.Types.ObjectId;
    paymentMode: string | Schema.Types.ObjectId;
    type: "credit" | "debit";
    month: number;
    year: number;
    totalAmount: number;
    status: "due" | "paid" | "refunded";
    userId: string | Schema.Types.ObjectId;
}

const expenseSummarySchema = new Schema<IExpenseSummary>({
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    paymentMode: { type: Schema.Types.ObjectId, ref: "PaymentMode", required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["due", "paid", "refunded"], required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const ExpenseSummary = models?.ExpenseSummary || mongoose.model<IExpenseSummary>("ExpenseSummary", expenseSummarySchema);
export default ExpenseSummary;