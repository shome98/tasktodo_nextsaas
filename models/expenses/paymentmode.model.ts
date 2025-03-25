import mongoose,{ Document, models, Schema } from "mongoose";

// export interface IPaymentMode extends Document{
//     name:string;
//     userId:string|Schema.Types.ObjectId;
//     createdAt?:Date;
//     updatedAt?:Date;
// }
export interface IPaymentMode extends Document{
    names:string[];
    userId:string|Schema.Types.ObjectId;
    createdAt?:Date;
    updatedAt?:Date;
}

export const defaultPaymentModes=["Credit Card","Debit Card","Online","Cash","UPI","Bank Transfer"];

const paymentModeSchema=new Schema<IPaymentMode>({
    names:{type:[String],required:true,default:defaultPaymentModes},
    userId:{type:Schema.Types.ObjectId,ref:"User",required:true}
},{timestamps:true});

function capitalizeFirstLetter(str:string) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

paymentModeSchema.pre('save', function(next) {
    this.names = this.names.map(name => capitalizeFirstLetter(name));
    next();
});

const PaymentMode=models?.PaymentMode||mongoose.model<IPaymentMode>("PaymentMode",paymentModeSchema);
export default PaymentMode;