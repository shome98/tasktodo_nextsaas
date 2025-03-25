import mongoose, { Document, models, Schema } from "mongoose";
import { ICategory } from "@/models/expenses/category.model";
import { IPaymentMode } from "@/models/expenses/paymentmode.model";

/*export interface IExpense extends Document
{
   description?:string;
   amaount:number;
   date?:Date;
   notes?:Date;
   createdAt?:Date;
   updatedAt?:Date;
   categoryId?:string|Schema.Types.ObjectId;
   paymentModeId?:string|Schema.Types.ObjectId;
   userId:string|Schema.Types.ObjectId;
} */
   export interface IExpense extends Document {
      amount: number;
      description: string;
      category: string | Schema.Types.ObjectId | ICategory;
      paymentMode: string | Schema.Types.ObjectId | IPaymentMode;
      type: "credit" | "debit";
      status: "due" | "paid" | "refunded";
      userId: string | Schema.Types.ObjectId;
      createdAt?: Date;
      updatedAt?: Date;
  }
  
  const expenseSchema = new Schema<IExpense>({
      amount: { type: Number, required: true },
      description: { type: String, required: true },
      category: { type: Schema.Types.ObjectId, ref: "Category", required: true},
      paymentMode: { type: Schema.Types.ObjectId, ref: "PaymentMode", required: true },
      type: { type: String, enum: ["credit", "debit"], required: true },
      status: { type: String, enum: ["due", "paid", "refunded"], required: true,default:"paid" },
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
  }, { timestamps: true });


const Expense = models?.Expense || mongoose.model<IExpense>("Expense", expenseSchema);
export default Expense;